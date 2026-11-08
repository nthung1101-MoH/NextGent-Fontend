// Service quản trị kho (API 5.1-5.5). Nguồn: BACKEND (AdminInventoriesController).
import { apiClient } from './apiClient';
import type { PortalInventoryItem, StockAdjustmentRecord, StockMovementRecord } from '../types/portal';
import { sharedStore } from './sharedStore';
import { isBackendDown, mockFallbackEnabled, serverMessage, unwrapData, warnFallback } from './apiHelpers';
import {
  bodyMessage,
  fetchAllPages,
  mapPage,
  toDateOnly,
  type AdminPage,
  type ServiceResult,
} from './mappers/adminCommon';
import {
  mapAdminAdjustment,
  mapAdminInventoryDetail,
  mapAdminInventoryItem,
  mapAdminMovement,
  mapInventorySummary,
  mapLowStockAlert,
  type AdminInventoryDetail,
  type InventorySummary,
  type LowStockAlert,
} from './mappers/adminInventoryMapper';
import { asRec } from './mappers/utils';

export type { AdminInventoryDetail, InventorySummary, LowStockAlert };

export interface InventoryListParams {
  page?: number;
  size?: number;
  keyword?: string;
  /** ALL | IN_STOCK | LOW_STOCK | OUT_OF_STOCK */
  status?: string;
  lowStockOnly?: boolean;
}

export interface MovementListParams {
  page?: number;
  size?: number;
  /** Mã phiếu: PXK, PNK, PKK... */
  formCode?: string;
  /** EXPORT | RETURN | ADJUST | IMPORT */
  txnType?: string;
  /** YYYY-MM-DD */
  startDate?: string;
  endDate?: string;
}

export interface StockAdjustmentInput {
  variantId: number;
  /** Số lượng đếm được thực tế; backend từ chối nếu nhỏ hơn số đang giữ chỗ. */
  actualCount: number;
  reason: string;
}

export interface AdminInventoryPage extends AdminPage<PortalInventoryItem> {
  summary: InventorySummary;
}

const emptyPage = <T>(items: T[]): AdminPage<T> => ({
  items,
  page: 1,
  size: items.length,
  totalPages: 1,
  totalElements: items.length,
  hasNext: false,
});

function summarize(rows: PortalInventoryItem[]): InventorySummary {
  return {
    totalOnHand: rows.reduce((s, r) => s + r.onHandQty, 0),
    totalReserved: rows.reduce((s, r) => s + r.reservedQty, 0),
    totalAvailable: rows.reduce((s, r) => s + r.availableQty, 0),
    lowStockCount: rows.filter((r) => r.status !== 'IN_STOCK').length,
  };
}

/** Chỉ query tham số có giá trị. */
const query = (o: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ''));

/** Gọi 5.1 và quy đổi sang kiểu giao diện (không dùng dữ liệu mẫu). */
async function fetchInventoryPage(params: InventoryListParams): Promise<AdminInventoryPage> {
  const res = await apiClient.get('/admin/inventories', {
    params: query({
      page: params.page ?? 1,
      size: params.size ?? 10,
      keyword: params.keyword?.trim(),
      status: params.status && params.status !== 'ALL' ? params.status : undefined,
      lowStockOnly: params.lowStockOnly ? true : undefined,
    }),
  });
  const body = unwrapData(res.data);
  return { ...mapPage(body, mapAdminInventoryItem), summary: mapInventorySummary(asRec(body)?.summary) };
}

export const adminInventoryService = {
  // 5.1 GET /admin/inventories: bảng tồn kho theo SKU kèm tổng hợp (summary).
  async getInventories(params: InventoryListParams = {}): Promise<AdminInventoryPage> {
    try {
      return await fetchInventoryPage(params);
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getInventories', e);
      const rows = sharedStore.getInventories();
      return { ...emptyPage(rows), summary: summarize(rows) };
    }
  },

  /** Lấy toàn bộ tồn kho (thay thế sharedStore.getInventories()). */
  async getAllInventories(params: Omit<InventoryListParams, 'page' | 'size'> = {}): Promise<PortalInventoryItem[]> {
    try {
      return await fetchAllPages((page, size) => fetchInventoryPage({ ...params, page, size }));
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getAllInventories', e);
      return sharedStore.getInventories();
    }
  },

  // 5.2 GET /admin/inventories/{varId}: chi tiết SKU kèm biến động gần đây. Lỗi 404: không có dữ liệu tồn kho.
  async getInventoryDetail(variantId: number): Promise<AdminInventoryDetail | null> {
    try {
      const res = await apiClient.get(`/admin/inventories/${variantId}`);
      const row = asRec(unwrapData(res.data));
      return row ? mapAdminInventoryDetail(row) : null;
    } catch (e) {
      if (isBackendDown(e) && mockFallbackEnabled()) {
        warnFallback('getInventoryDetail', e);
        const item = sharedStore.getInventories().find((i) => i.variantId === variantId);
        if (!item) return null;
        const recent = sharedStore.getMovements().filter((m) => m.sku === item.sku).slice(0, 10);
        return { ...item, updatedAt: '', recentTransactions: recent };
      }
      throw e;
    }
  },

  // 5.3 POST /admin/inventories/adjustments: lập phiếu kiểm kê MB05, cân đối tồn kho.
  async createStockAdjustment(input: StockAdjustmentInput): Promise<ServiceResult<StockAdjustmentRecord>> {
    try {
      const res = await apiClient.post('/admin/inventories/adjustments', {
        variantId: input.variantId,
        actualCount: input.actualCount,
        reason: input.reason.trim(),
      });
      const row = asRec(unwrapData(res.data));
      return {
        success: true,
        message: bodyMessage(res.data, 'Lập phiếu kiểm kê MB05 và cân đối tồn kho thành công!'),
        data: row ? mapAdminAdjustment(row) : undefined,
      };
    } catch (e) {
      if (isBackendDown(e) && mockFallbackEnabled()) {
        warnFallback('createStockAdjustment', e);
        const sku = sharedStore.getInventories().find((i) => i.variantId === input.variantId)?.sku;
        if (!sku) return { success: false, message: 'Không tìm thấy SKU trong kho!' };
        return sharedStore.createStockAdjustment(sku, input.actualCount, input.reason.trim());
      }
      return { success: false, message: serverMessage(e, 'Không thể lập phiếu kiểm kê. Vui lòng thử lại sau.') };
    }
  },

  // 5.4 GET /admin/inventories/transactions: sổ cái biến động kho. Ngày lọc phải đúng YYYY-MM-DD.
  async getMovements(params: MovementListParams = {}): Promise<AdminPage<StockMovementRecord>> {
    try {
      const res = await apiClient.get('/admin/inventories/transactions', {
        params: query({
          page: params.page ?? 1,
          size: params.size ?? 10,
          formCode: params.formCode?.trim(),
          txnType: params.txnType && params.txnType !== 'ALL' ? params.txnType : undefined,
          startDate: params.startDate ? toDateOnly(params.startDate) : undefined,
          endDate: params.endDate ? toDateOnly(params.endDate) : undefined,
        }),
      });
      return mapPage(unwrapData(res.data), mapAdminMovement);
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getMovements', e);
      return emptyPage(sharedStore.getMovements());
    }
  },

  // 5.5 GET /admin/inventories/low-stock: biến thể chạm ngưỡng an toàn.
  async getLowStockAlerts(page = 1, size = 10): Promise<AdminPage<LowStockAlert>> {
    try {
      const res = await apiClient.get('/admin/inventories/low-stock', { params: { page, size } });
      return mapPage(unwrapData(res.data), mapLowStockAlert);
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getLowStockAlerts', e);
      const rows = sharedStore
        .getInventories()
        .filter((i) => i.status !== 'IN_STOCK')
        .map<LowStockAlert>((i) => ({
          variantId: i.variantId,
          productId: i.productId,
          productName: i.productName,
          sku: i.sku,
          color: i.color,
          onHandQty: i.onHandQty,
          reservedQty: i.reservedQty,
          availableQty: i.availableQty,
          minThreshold: i.minThreshold,
          deficit: Math.max(0, i.minThreshold - i.availableQty),
          status: i.status,
          recommendImportQty: Math.max(0, i.minThreshold - i.availableQty),
        }));
      return emptyPage(rows);
    }
  },
};
