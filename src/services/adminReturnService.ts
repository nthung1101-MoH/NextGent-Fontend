import { apiClient } from './apiClient';
import { PortalReturnRequest } from '../types/portal';
import { sharedStore } from './sharedStore';
import { hasSession, isBackendDown, mockFallbackEnabled, serverMessage, unwrapData, warnFallback } from './apiHelpers';
import { cleanParams, isMissingEndpoint, mapAdminPage, paginateRows, withMock, type AdminPage } from './mappers/adminCommonMapper';
import { mapInspectResult, mapPortalReturn, type AdminInspectResult } from './mappers/adminReturnMapper';
import { asRec } from './mappers/utils';

export interface AdminReturnQuery {
  page?: number;
  size?: number;
  status?: PortalReturnRequest['status'];
}

export interface InspectReturnInput {
  status: 'APPROVED' | 'REJECTED';
  inspectionResult: string;
  /** Bat buoc khi APPROVED. */
  refundAmount?: number;
  /** Bat buoc khi REJECTED. */
  rejectReason?: string;
}

export interface AdminInspectActionResult {
  success: boolean;
  message: string;
  result?: AdminInspectResult;
}

/**
 * Quan tri doi tra (STAFF/ADMIN). Nguon: THEO DAC TA - backend chua co controller doi tra.
 * Chi 11.3 co mau request/response trong dac ta (muc VIII.8.1); 11.2 (danh sach) khong co mau nen mapper doc linh hoat.
 * 404/405 duoc coi la "endpoint chua trien khai" va roi ve du lieu mau khi VITE_ENABLE_MOCK_FALLBACK != false.
 */
export const adminReturnService = {
  /** 11.2 GET /admin/returns */
  async listReturns(q: AdminReturnQuery = {}): Promise<AdminPage<PortalReturnRequest>> {
    const page = q.page ?? 1;
    const size = q.size ?? 10;
    return withMock('GET /admin/returns', async () => {
      const res = await apiClient.get('/admin/returns', { params: cleanParams({ page, size, status: q.status }) });
      return mapAdminPage(unwrapData(res.data), mapPortalReturn);
    }, () => paginateRows(sharedStore.getReturnRequests().filter((r) => !q.status || r.status === q.status), page, size),
    { missingEndpoint: true, errorMessage: 'Không thể tải danh sách yêu cầu đổi trả.' });
  },

  /**
   * 11.3 PUT /admin/returns/{id}/inspect - lap bien ban kiem dinh MB04, duyet hoan tien/hoan kho hoac tu choi.
   * Loi nghiep vu tra { success:false, message } (giong sharedStore) thay vi nem.
   */
  async inspectReturn(returnId: number, input: InspectReturnInput, staffName = 'Nhân viên kiểm định'): Promise<AdminInspectActionResult> {
    const mock = (): AdminInspectActionResult => {
      if (input.status === 'REJECTED') {
        const ok = sharedStore.rejectReturnRequest(returnId, input.rejectReason ?? input.inspectionResult, staffName);
        return { success: ok, message: ok ? 'Đã từ chối yêu cầu đổi trả.' : 'Không thể từ chối yêu cầu đổi trả.' };
      }
      const inspected = sharedStore.inspectReturnRequest(returnId, input.inspectionResult, staffName);
      const refunded = inspected && sharedStore.approveAndRefundReturn(returnId, input.refundAmount ?? 0, staffName);
      return { success: refunded, message: refunded ? 'Đã duyệt hoàn tiền và nhập kho hoàn hàng.' : 'Không thể duyệt yêu cầu đổi trả.' };
    };
    if (!hasSession() && mockFallbackEnabled()) return mock();
    try {
      const res = await apiClient.put(`/admin/returns/${returnId}/inspect`, {
        status: input.status,
        inspectionResult: input.inspectionResult,
        refundAmount: input.refundAmount ?? null,
        rejectReason: input.rejectReason ?? null,
      });
      const body = res.data as { message?: unknown } | null;
      return {
        success: true,
        message: typeof body?.message === 'string' && body.message ? body.message : 'Đã lập biên bản kiểm định.',
        result: mapInspectResult(asRec(unwrapData(res.data)) ?? {}),
      };
    } catch (e) {
      if (mockFallbackEnabled() && (isBackendDown(e) || isMissingEndpoint(e))) {
        warnFallback('PUT /admin/returns/{id}/inspect', e);
        return mock();
      }
      return { success: false, message: serverMessage(e, 'Không thể lập biên bản kiểm định.') };
    }
  },
};
