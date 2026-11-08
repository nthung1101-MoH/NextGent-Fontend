import { apiClient } from './apiClient';
import { sharedStore } from './sharedStore';
import { isBackendDown, mockFallbackEnabled, serverMessage, unwrapData, warnFallback } from './apiHelpers';
import { asRec, listOf, num, pick, str, totalPagesOf, type Rec } from './mappers/utils';
import { errorCodeOf, type ServiceResult } from './apiHelpers';
import type { PortalFaqItem, PortalSupportTicket } from '../types/portal';

const PAGE_SIZE = 100;
const MAX_PAGES = 5;

/** FaqResponse (backend) -> PortalFaqItem. Backend: category -> topic, displayOrder -> sortOrder, isActive -> isVisible. */
function mapFaq(raw: Rec): PortalFaqItem {
  return {
    faqId: num(pick(raw, 'faqId', 'id')),
    topic: str(pick(raw, 'category', 'topic')),
    question: str(pick(raw, 'question')),
    answer: str(pick(raw, 'answer')),
    isVisible: pick(raw, 'isActive', 'isVisible') === undefined ? true : Boolean(pick(raw, 'isActive', 'isVisible')),
    sortOrder: num(pick(raw, 'displayOrder', 'sortOrder')),
  };
}

/**
 * Trang thai ticket backend (OPEN | IN_PROGRESS | RESOLVED | CLOSED) -> WAITING | RESOLVED | REJECTED cua giao dien.
 * Giao dien khong co "dang xu ly" / "da dong" nen: OPEN, IN_PROGRESS -> WAITING; RESOLVED, CLOSED -> RESOLVED.
 */
function mapTicket(raw: Rec): PortalSupportTicket {
  const status = str(pick(raw, 'status')).toUpperCase();
  return {
    ticketId: num(pick(raw, 'ticketId', 'id')),
    customerName: str(pick(raw, 'customerName')),
    phone: str(pick(raw, 'customerPhone', 'phone')),
    category: str(pick(raw, 'subject', 'category')),
    content: str(pick(raw, 'description', 'content')),
    status: status === 'RESOLVED' || status === 'CLOSED' ? 'RESOLVED' : 'WAITING',
    reply: pick(raw, 'resolutionNote') === undefined ? undefined : str(pick(raw, 'resolutionNote')),
    handledBy: pick(raw, 'handledByName') === undefined ? undefined : str(pick(raw, 'handledByName')),
    createdAt: str(pick(raw, 'createdAt'), new Date().toISOString()),
    handledAt: pick(raw, 'resolvedAt') === undefined ? undefined : str(pick(raw, 'resolvedAt')),
  };
}

export const supportService = {
  // 12.6 GET /faqs (Public). Backend chi tra FAQ dang hien thi, da sap xep theo displayOrder.
  async getFaqs(): Promise<PortalFaqItem[]> {
    try {
      const rows: PortalFaqItem[] = [];
      for (let page = 1; page <= MAX_PAGES; page++) {
        const res = await apiClient.get('/faqs', { params: { page, size: PAGE_SIZE } });
        const body = unwrapData(res.data);
        rows.push(...listOf(body).map(mapFaq));
        if (page >= totalPagesOf(body)) break;
      }
      return rows.filter((f) => f.isVisible);
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getFaqs', e);
      return sharedStore.getFaqs().filter((f) => f.isVisible);
    }
  },

  /**
   * 12.4 POST /support-tickets. Backend bat buoc dang nhap va lay ten / SDT / email tu tai khoan,
   * nen `customerName` va `phone` cua form khong duoc gui di. category -> subject, content -> description.
   * Loi 400: tieu de > 200 ky tu, noi dung > 5000 ky tu.
   */
  async submitTicket(input: { customerName?: string; phone?: string; category: string; content: string }): Promise<ServiceResult<PortalSupportTicket>> {
    const subject = input.category.trim();
    const description = input.content.trim();
    if (!subject) return { success: false, message: 'Tiêu đề ticket không được để trống', code: 'INVALID_REQUEST' };
    if (!description) return { success: false, message: 'Nội dung ticket không được để trống', code: 'INVALID_REQUEST' };
    try {
      const res = await apiClient.post('/support-tickets', { subject, description });
      const data = asRec(unwrapData(res.data));
      const message = (res.data as { message?: string } | undefined)?.message ?? 'Tạo ticket hỗ trợ thành công';
      return data ? { success: true, message, data: mapTicket(data) } : { success: true, message };
    } catch (e) {
      if (isBackendDown(e)) {
        if (!mockFallbackEnabled()) return { success: false, message: 'Không kết nối được máy chủ. Vui lòng thử lại sau.' };
        warnFallback('submitTicket', e);
        // Giao dien mau hien chi xac nhan da gui, khong luu ticket (sharedStore khong co ham them ticket).
        return { success: true, message: 'Đã ghi nhận yêu cầu hỗ trợ.', code: 'OFFLINE' };
      }
      return { success: false, message: serverMessage(e, 'Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại.'), code: errorCodeOf(e) };
    }
  },
};
