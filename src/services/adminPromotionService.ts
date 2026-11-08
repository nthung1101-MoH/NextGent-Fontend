// Service quản trị khuyến mãi & voucher (API 6.2, 6.3, 6.4, 6.7, 6.8, 6.9). Nguồn: BACKEND
// (AdminPromotionsController, AdminVouchersController).
import { apiClient } from './apiClient';
import type { PortalPromotion, PortalVoucher, PromotionStatus } from '../types/portal';
import { sharedStore } from './sharedStore';
import { isBackendDown, mockFallbackEnabled, serverMessage, unwrapData, warnFallback } from './apiHelpers';
import { bodyMessage, fetchAllPages, mapPage, type AdminPage, type ServiceResult } from './mappers/adminCommon';
import {
  mapAdminPromotion,
  mapAdminVoucher,
  mapCreatedPromotion,
  mapCreatedVoucher,
  promotionBody,
  promotionStatus,
  voucherBody,
  type AdminPromotionInput,
  type AdminPromotionRow,
  type AdminVoucherInput,
} from './mappers/adminPromotionMapper';
import { asRec, pick } from './mappers/utils';

export type { AdminPromotionInput, AdminPromotionRow, AdminVoucherInput };

export interface PromotionListParams {
  page?: number;
  size?: number;
  /** ALL | ACTIVE | UPCOMING | PAUSED | ENDED */
  status?: string;
}

export interface VoucherListParams {
  page?: number;
  size?: number;
  /** Tìm theo mã hoặc tên voucher. */
  keyword?: string;
  /** ALL | ACTIVE | INACTIVE */
  status?: string;
}

const onePage = <T>(items: T[]): AdminPage<T> => ({
  items,
  page: 1,
  size: items.length,
  totalPages: 1,
  totalElements: items.length,
  hasNext: false,
});

const clean = (o: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== ''));

async function fetchPromotionPage(params: PromotionListParams): Promise<AdminPage<AdminPromotionRow>> {
  const res = await apiClient.get('/admin/promotions', {
    params: clean({
      page: params.page ?? 1,
      size: params.size ?? 10,
      status: params.status && params.status !== 'ALL' ? params.status : undefined,
    }),
  });
  return mapPage(unwrapData(res.data), mapAdminPromotion);
}

async function fetchVoucherPage(params: VoucherListParams): Promise<AdminPage<PortalVoucher>> {
  const res = await apiClient.get('/admin/vouchers', {
    params: clean({
      page: params.page ?? 1,
      size: params.size ?? 10,
      keyword: params.keyword?.trim(),
      status: params.status && params.status !== 'ALL' ? params.status : undefined,
    }),
  });
  return mapPage(unwrapData(res.data), mapAdminVoucher);
}

const toRow = (p: PortalPromotion): AdminPromotionRow => ({ ...p, appliedVariantsCount: p.variants.length });

export const adminPromotionService = {
  // 6.2 GET /admin/promotions: danh sách chiến dịch (không kèm chi tiết biến thể, chỉ có appliedVariantsCount).
  async getPromotions(params: PromotionListParams = {}): Promise<AdminPage<AdminPromotionRow>> {
    try {
      return await fetchPromotionPage(params);
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getPromotions', e);
      const status = params.status && params.status !== 'ALL' ? params.status : undefined;
      return onePage(sharedStore.getPromotions().filter((p) => !status || p.status === status).map(toRow));
    }
  },

  /** Lấy toàn bộ chiến dịch (thay thế sharedStore.getPromotions(); variants rỗng vì 6.2 không trả chi tiết). */
  async getAllPromotions(status?: string): Promise<AdminPromotionRow[]> {
    try {
      return await fetchAllPages((page, size) => fetchPromotionPage({ page, size, status }));
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getAllPromotions', e);
      return sharedStore.getPromotions().map(toRow);
    }
  },

  // 6.3 POST /admin/promotions: tạo chiến dịch kèm danh sách SKU và giá. Lỗi 400: thiếu variants, giá âm, ngày sai.
  async createPromotion(input: AdminPromotionInput): Promise<ServiceResult<PortalPromotion>> {
    try {
      const res = await apiClient.post('/admin/promotions', promotionBody(input));
      return {
        success: true,
        message: bodyMessage(res.data, 'Tạo mới chiến dịch khuyến mãi thành công!'),
        data: mapCreatedPromotion(asRec(unwrapData(res.data)), input),
      };
    } catch (e) {
      if (isBackendDown(e) && mockFallbackEnabled()) {
        warnFallback('createPromotion', e);
        return { success: true, message: 'Tạo mới chiến dịch khuyến mãi thành công!', data: sharedStore.addPromotion(input) };
      }
      return { success: false, message: serverMessage(e, 'Không thể tạo chiến dịch khuyến mãi. Vui lòng thử lại sau.') };
    }
  },

  // 6.4 PUT /admin/promotions/{id}/status: đổi trạng thái (ACTIVE | UPCOMING | PAUSED | ENDED), kèm lý do tùy chọn.
  async updatePromotionStatus(
    id: number,
    status: PromotionStatus,
    reason?: string
  ): Promise<ServiceResult<{ promotionId: number; status: PromotionStatus }>> {
    try {
      const res = await apiClient.put(`/admin/promotions/${id}/status`, { status, reason: reason?.trim() || undefined });
      const row = asRec(unwrapData(res.data));
      return {
        success: true,
        message: bodyMessage(res.data, 'Cập nhật trạng thái chiến dịch khuyến mãi thành công!'),
        data: { promotionId: id, status: row ? promotionStatus(pick(row, 'status')) : status },
      };
    } catch (e) {
      if (isBackendDown(e) && mockFallbackEnabled()) {
        warnFallback('updatePromotionStatus', e);
        const current = sharedStore.getPromotions().find((p) => p.promotionId === id);
        if (!current) return { success: false, message: 'Không tìm thấy chiến dịch khuyến mãi!' };
        // sharedStore chỉ có thao tác đảo ACTIVE <-> PAUSED
        if (current.status !== status) sharedStore.togglePromotionStatus(id);
        return { success: true, message: 'Cập nhật trạng thái chiến dịch khuyến mãi thành công!', data: { promotionId: id, status } };
      }
      return { success: false, message: serverMessage(e, 'Không thể cập nhật trạng thái chiến dịch. Vui lòng thử lại sau.') };
    }
  },

  /** Đảo ACTIVE <-> PAUSED (tương đương sharedStore.togglePromotionStatus) bằng API 6.4. */
  togglePromotionStatus(id: number, current: PromotionStatus) {
    return adminPromotionService.updatePromotionStatus(id, current === 'ACTIVE' ? 'PAUSED' : 'ACTIVE');
  },

  // 6.7 GET /admin/vouchers: danh sách mã giảm giá, lọc theo từ khóa và trạng thái.
  async getVouchers(params: VoucherListParams = {}): Promise<AdminPage<PortalVoucher>> {
    try {
      return await fetchVoucherPage(params);
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getVouchers', e);
      return onePage(sharedStore.getVouchers());
    }
  },

  /** Lấy toàn bộ voucher (thay thế sharedStore.getVouchers()). */
  async getAllVouchers(params: Omit<VoucherListParams, 'page' | 'size'> = {}): Promise<PortalVoucher[]> {
    try {
      return await fetchAllPages((page, size) => fetchVoucherPage({ ...params, page, size }));
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getAllVouchers', e);
      return sharedStore.getVouchers();
    }
  },

  // 6.8 POST /admin/vouchers. Lỗi: 409 trùng mã, 400 sai loại giảm giá hoặc startAt không trước expiredAt.
  // sharedStore chưa có hàm tạo voucher nên không có dữ liệu mẫu để dự phòng: lỗi kết nối sẽ trả thông báo lỗi.
  async createVoucher(input: AdminVoucherInput): Promise<ServiceResult<PortalVoucher>> {
    try {
      const res = await apiClient.post('/admin/vouchers', voucherBody(input));
      return {
        success: true,
        message: bodyMessage(res.data, 'Khởi tạo mã Voucher thành công!'),
        data: mapCreatedVoucher(asRec(unwrapData(res.data)), input),
      };
    } catch (e) {
      return { success: false, message: serverMessage(e, 'Không thể tạo mã voucher. Vui lòng thử lại sau.') };
    }
  },

  // 6.9 PATCH /admin/vouchers/{id}/toggle: bật/tắt kích hoạt, không cần body. Trả về trạng thái mới.
  async toggleVoucher(id: number): Promise<ServiceResult<{ voucherId: number; code: string; isActive: boolean }>> {
    try {
      const res = await apiClient.patch(`/admin/vouchers/${id}/toggle`);
      const row = asRec(unwrapData(res.data));
      return {
        success: true,
        message: bodyMessage(res.data, 'Thay đổi trạng thái kích hoạt Voucher thành công!'),
        data: row
          ? { voucherId: id, code: String(pick(row, 'code') ?? ''), isActive: pick(row, 'isActive') !== false }
          : undefined,
      };
    } catch (e) {
      return { success: false, message: serverMessage(e, 'Không thể đổi trạng thái voucher. Vui lòng thử lại sau.') };
    }
  },
};
