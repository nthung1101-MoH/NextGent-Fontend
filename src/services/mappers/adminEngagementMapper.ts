import type { PortalAuditLog, PortalFaqItem, PortalSupportTicket } from '../../types/portal';
import type { ProductReview } from '../../types/review';
import { mapAdminPage, type AdminPage } from './adminCommonMapper';
import { asRec, num, optNum, pick, str, maskPhone, type Rec } from './utils';

const optStr = (v: unknown): string | undefined => (v === undefined ? undefined : str(v));

// ---------- 12.3 Danh gia ----------
export interface AdminReview extends ProductReview {
  /** Trang thai hien thi cua danh gia (VISIBLE | HIDDEN). */
  status?: string;
  variantName?: string;
}

/** ReviewResponse -> ProductReview (+status). Backend khong co anh dinh kem va so dien thoai nguoi danh gia. */
export function mapAdminReview(raw: Rec): AdminReview {
  const phone = pick(raw, 'customerPhone', 'userPhone');
  const reply = pick(raw, 'reply', 'storeReply');
  return {
    reviewId: num(pick(raw, 'reviewId', 'id')),
    orderItemId: optNum(pick(raw, 'orderItemId')),
    productId: num(pick(raw, 'productId')),
    productName: optStr(pick(raw, 'productName')),
    userName: str(pick(raw, 'customerName', 'userName')),
    userPhoneMasked: phone === undefined ? '' : maskPhone(str(phone)),
    rating: num(pick(raw, 'rating'), 5),
    comment: str(pick(raw, 'comment')),
    storeReply: reply === undefined ? undefined : str(reply),
    repliedAt: optStr(pick(raw, 'repliedAt')),
    images: undefined,
    createdAt: str(pick(raw, 'createdAt')),
    isBuyerVerified: pick(raw, 'isVerifiedPurchase', 'isBuyerVerified') === true,
    status: optStr(pick(raw, 'status')),
    variantName: optStr(pick(raw, 'variantName')),
  };
}

// ---------- 12.5 Ticket ho tro ----------
export interface AdminTicket extends PortalSupportTicket {
  subject?: string;
  priority?: string;
  customerEmail?: string;
  resolutionNote?: string;
  /** Trang thai goc cua backend: OPEN | IN_PROGRESS | RESOLVED | CLOSED. */
  rawStatus?: string;
}

export function mapTicketStatus(raw: unknown): PortalSupportTicket['status'] {
  const v = str(raw).toUpperCase();
  if (v === 'RESOLVED') return 'RESOLVED';
  if (v === 'CLOSED' || v === 'REJECTED') return 'REJECTED';
  return 'WAITING';   // OPEN, IN_PROGRESS
}

/** SupportTicketResponse -> PortalSupportTicket. category <- subject (backend khong co truong category). */
export function mapAdminTicket(raw: Rec): AdminTicket {
  const note = pick(raw, 'resolutionNote');
  return {
    ticketId: num(pick(raw, 'ticketId', 'id')),
    customerName: str(pick(raw, 'customerName')),
    phone: str(pick(raw, 'customerPhone', 'phone')),
    category: str(pick(raw, 'subject', 'category')),
    content: str(pick(raw, 'description', 'content')),
    status: mapTicketStatus(pick(raw, 'status')),
    reply: note === undefined ? undefined : str(note),
    handledBy: optStr(pick(raw, 'handledByName')),
    createdAt: str(pick(raw, 'createdAt')),
    handledAt: optStr(pick(raw, 'resolvedAt')),
    subject: optStr(pick(raw, 'subject')),
    priority: optStr(pick(raw, 'priority')),
    customerEmail: optStr(pick(raw, 'customerEmail')),
    resolutionNote: note === undefined ? undefined : str(note),
    rawStatus: optStr(pick(raw, 'status')),
  };
}

export interface AdminTicketPage extends AdminPage<AdminTicket> {
  statusCounts: Record<string, number>;
}

export function mapAdminTicketPage(data: unknown): AdminTicketPage {
  const counts: Record<string, number> = {};
  const c = asRec(pick(asRec(data), 'statusCounts'));
  if (c) for (const [k, v] of Object.entries(c)) counts[k] = num(v);
  return { ...mapAdminPage(data, mapAdminTicket), statusCounts: counts };
}

// ---------- 12.7 FAQ ----------
/** FaqResponse -> PortalFaqItem (topic <- category, isVisible <- isActive, sortOrder <- displayOrder). */
export function mapAdminFaq(raw: Rec): PortalFaqItem {
  return {
    faqId: num(pick(raw, 'faqId', 'id')),
    topic: str(pick(raw, 'category', 'topic')),
    question: str(pick(raw, 'question')),
    answer: str(pick(raw, 'answer')),
    isVisible: pick(raw, 'isActive', 'isVisible') !== false,
    sortOrder: num(pick(raw, 'displayOrder', 'sortOrder'), 0),
  };
}

/** PortalFaqItem -> FaqRequest cua backend. */
export function toFaqRequest(d: Omit<PortalFaqItem, 'faqId'>): Record<string, unknown> {
  return {
    question: d.question,
    answer: d.answer,
    category: d.topic,
    displayOrder: d.sortOrder,
    isActive: d.isVisible,
  };
}

// ---------- 13.5 Nhat ky he thong ----------
/**
 * THEO DAC TA: backend chua co controller audit-logs; entity AuditLog gom logId, user, action, entityName, entityId,
 * oldValue, newValue, createdAt. Nguoi thuc hien doc linh hoat (chuoi hoac doi tuong user).
 */
export function mapAdminAuditLog(raw: Rec): PortalAuditLog {
  const user = asRec(pick(raw, 'user'));
  return {
    logId: num(pick(raw, 'logId', 'id')),
    performedBy: str(pick(raw, 'performedBy', 'userName', 'fullName', 'email') ?? pick(user, 'fullName', 'email')),
    action: str(pick(raw, 'action')),
    entityName: str(pick(raw, 'entityName')),
    entityId: str(pick(raw, 'entityId')),
    oldValue: str(pick(raw, 'oldValue')),
    newValue: str(pick(raw, 'newValue')),
    createdAt: str(pick(raw, 'createdAt')),
  };
}
