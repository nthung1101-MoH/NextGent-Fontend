import { apiClient } from './apiClient';
import { OrderStatus } from '../types/order';
import { sharedStore } from './sharedStore';
import { unwrapData } from './apiHelpers';
import { cleanParams, paginateRows, withMock } from './mappers/adminCommonMapper';
import {
  mapAdminOrderPage, mapConfirmOrderResult, mapPackExportResult, orderDetailToAdminRow, summarizePipeline,
  type AdminConfirmResult, type AdminOrderPage, type AdminPackExportResult,
} from './mappers/adminOrderMapper';
import { asRec } from './mappers/utils';

export interface AdminOrderQuery {
  page?: number;
  size?: number;
  /** Trang thai don (giao dien) hoac 'ALL'. */
  status?: OrderStatus | 'ALL';
  paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED' | 'ALL';
}

export interface ConfirmOrderInput { carrier: string; note?: string }
export interface PackExportInput { packageWeightGrams?: number; exportNote?: string; assignedShipper?: string }

const DEFAULT_STAFF = 'Nhân viên vận hành (Staff)';

/**
 * Quan tri don hang (STAFF/ADMIN). Nguon: BACKEND (AdminOrdersController).
 * Cac trang portal hien goi truc tiep sharedStore; service nay san sang de noi vao khi nhom giao dien chuyen doi.
 */
export const adminOrderService = {
  /** 8.5 GET /admin/orders - danh sach don kem tong hop pipeline 7 trang thai. */
  async listOrders(q: AdminOrderQuery = {}): Promise<AdminOrderPage> {
    const page = q.page ?? 1;
    const size = q.size ?? 10;
    return withMock('GET /admin/orders', async () => {
      const res = await apiClient.get('/admin/orders', {
        params: cleanParams({ page, size, status: q.status ?? 'ALL', paymentStatus: q.paymentStatus ?? 'ALL' }),
      });
      return mapAdminOrderPage(unwrapData(res.data));
    }, () => {
      const all = sharedStore.getOrders().map(orderDetailToAdminRow);
      const filtered = all.filter((r) =>
        (!q.status || q.status === 'ALL' || r.status === q.status) &&
        (!q.paymentStatus || q.paymentStatus === 'ALL' || r.paymentStatus === q.paymentStatus));
      return { ...paginateRows(filtered, page, size), pipelineSummary: summarizePipeline(all) };
    }, { errorMessage: 'Không thể tải danh sách đơn hàng.' });
  },

  /** 8.6 POST /admin/orders/{id}/confirm - xac nhan don (MB02), tao van don. Ném Error kem thong bao neu that bai. */
  async confirmOrder(orderId: number, input: ConfirmOrderInput, staffName = DEFAULT_STAFF): Promise<AdminConfirmResult> {
    return withMock('POST /admin/orders/{id}/confirm', async () => {
      const res = await apiClient.post(`/admin/orders/${orderId}/confirm`, { carrier: input.carrier, note: input.note });
      return mapConfirmOrderResult(asRec(unwrapData(res.data)) ?? {});
    }, () => {
      const r = sharedStore.transitionOrderStatus(orderId, 'CONFIRMED', { performedBy: staffName, carrier: input.carrier, reason: input.note });
      if (!r.success) throw new Error(r.message);
      const o = sharedStore.getOrderById(orderId);
      return { orderId, orderCode: o?.orderCode ?? '', status: o?.status ?? 'CONFIRMED', formCode: '' };
    }, { errorMessage: 'Không thể xác nhận đơn hàng.' });
  },

  /** 8.7 POST /admin/orders/{id}/pack-export - dong goi & xuat kho (MB03), tru ton kho vat ly. */
  async packExportOrder(orderId: number, input: PackExportInput = {}, staffName = DEFAULT_STAFF): Promise<AdminPackExportResult> {
    return withMock('POST /admin/orders/{id}/pack-export', async () => {
      const res = await apiClient.post(`/admin/orders/${orderId}/pack-export`, {
        packageWeightGrams: input.packageWeightGrams,
        exportNote: input.exportNote,
        assignedShipper: input.assignedShipper,
      });
      return mapPackExportResult(asRec(unwrapData(res.data)) ?? {});
    }, () => {
      const r = sharedStore.transitionOrderStatus(orderId, 'SHIPPING', { performedBy: staffName, reason: input.exportNote });
      if (!r.success) throw new Error(r.message);
      const o = sharedStore.getOrderById(orderId);
      return { orderId, orderCode: o?.orderCode ?? '', status: o?.status ?? 'SHIPPING', formCode: '', inventoryDeducted: false, exportedItems: [] };
    }, { errorMessage: 'Không thể đóng gói và xuất kho.' });
  },
};
