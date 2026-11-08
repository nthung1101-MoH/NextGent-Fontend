import { apiClient } from './apiClient';
import { PortalAuditLog, PortalFaqItem } from '../types/portal';
import { sharedStore } from './sharedStore';
import { unwrapData } from './apiHelpers';
import { cleanParams, mapAdminPage, paginateRows, withMock, type AdminPage } from './mappers/adminCommonMapper';
import {
  mapAdminAuditLog, mapAdminFaq, mapAdminReview, mapAdminTicketPage, toFaqRequest,
  type AdminReview, type AdminTicketPage,
} from './mappers/adminEngagementMapper';
import { asRec } from './mappers/utils';

export interface AdminReviewQuery { page?: number; size?: number; status?: string; rating?: number; search?: string }
export interface AdminTicketQuery { page?: number; size?: number; status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'; priority?: string; search?: string }
export interface AdminAuditLogQuery { page?: number; size?: number }

/**
 * Danh gia, ticket ho tro, FAQ, nhat ky he thong (quan tri).
 * Nguon: 12.3, 12.5, 12.7 = BACKEND (AdminReviewsController, AdminSupportTicketsController, AdminFaqsController);
 * 13.5 = THEO DAC TA (backend chua co controller audit-logs; 404/405 roi ve du lieu mau).
 */
export const adminEngagementService = {
  /** 12.3 GET /admin/reviews */
  async listReviews(q: AdminReviewQuery = {}): Promise<AdminPage<AdminReview>> {
    const page = q.page ?? 1;
    const size = q.size ?? 10;
    return withMock('GET /admin/reviews', async () => {
      const res = await apiClient.get('/admin/reviews', { params: cleanParams({ page, size, status: q.status, rating: q.rating, search: q.search }) });
      return mapAdminPage(unwrapData(res.data), mapAdminReview);
    }, () => {
      const kw = q.search?.trim().toLowerCase();
      const rows = sharedStore.getReviews().filter((r) =>
        (!q.rating || r.rating === q.rating) &&
        (!kw || r.comment.toLowerCase().includes(kw) || r.userName.toLowerCase().includes(kw) || (r.productName ?? '').toLowerCase().includes(kw)));
      return paginateRows<AdminReview>(rows, page, size);
    }, { errorMessage: 'Không thể tải danh sách đánh giá.' });
  },

  /** 12.5 GET /admin/support-tickets (kem thong ke theo trang thai). */
  async listTickets(q: AdminTicketQuery = {}): Promise<AdminTicketPage> {
    const page = q.page ?? 1;
    const size = q.size ?? 10;
    return withMock('GET /admin/support-tickets', async () => {
      const res = await apiClient.get('/admin/support-tickets', { params: cleanParams({ page, size, status: q.status, priority: q.priority, search: q.search }) });
      return mapAdminTicketPage(unwrapData(res.data));
    }, () => {
      const kw = q.search?.trim().toLowerCase();
      const all = sharedStore.getTickets();
      const rows = all.filter((t) => !kw || t.content.toLowerCase().includes(kw) || t.customerName.toLowerCase().includes(kw));
      const counts: Record<string, number> = {};
      all.forEach((t) => { counts[t.status] = (counts[t.status] ?? 0) + 1; });
      return { ...paginateRows(rows, page, size), statusCounts: counts };
    }, { errorMessage: 'Không thể tải danh sách ticket hỗ trợ.' });
  },

  /** 12.7 POST /admin/faqs - tao cau hoi thuong gap. */
  async createFaq(data: Omit<PortalFaqItem, 'faqId'>): Promise<PortalFaqItem> {
    return withMock('POST /admin/faqs', async () => {
      const res = await apiClient.post('/admin/faqs', toFaqRequest(data));
      return mapAdminFaq(asRec(unwrapData(res.data)) ?? {});
    }, () => sharedStore.addFaq(data), { errorMessage: 'Không thể tạo câu hỏi thường gặp.' });
  },

  /** 13.5 GET /admin/audit-logs - THEO DAC TA (chi gui page, size vi dac ta khong neu bo loc). */
  async listAuditLogs(q: AdminAuditLogQuery = {}): Promise<AdminPage<PortalAuditLog>> {
    const page = q.page ?? 1;
    const size = q.size ?? 20;
    return withMock('GET /admin/audit-logs', async () => {
      const res = await apiClient.get('/admin/audit-logs', { params: { page, size } });
      return mapAdminPage(unwrapData(res.data), mapAdminAuditLog);
    }, () => paginateRows(sharedStore.getAuditLogs(), page, size), { missingEndpoint: true, errorMessage: 'Không thể tải nhật ký hệ thống.' });
  },
};
