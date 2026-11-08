import type { NotificationItem, NotificationType } from '../../types/notification';
import { num, optNum, pick, str, type Rec } from './utils';

function mapType(raw: Rec): NotificationType {
  const t = str(pick(raw, 'type', 'category')).toUpperCase();
  if (t.includes('ORDER')) return 'ORDER';
  if (t.includes('PROMO') || t.includes('VOUCHER') || t.includes('SALE')) return 'PROMO';
  if (t) return 'SYSTEM';
  return pick(raw, 'orderId', 'orderCode', 'relatedOrderId') !== undefined ? 'ORDER' : 'SYSTEM';
}

export function mapNotification(raw: Rec): NotificationItem {
  return {
    notificationId: num(pick(raw, 'notificationId', 'id')),
    userId: num(pick(raw, 'userId')),
    orderId: optNum(pick(raw, 'orderId', 'relatedOrderId')),
    orderCode: pick(raw, 'orderCode') === undefined ? undefined : str(pick(raw, 'orderCode')),
    title: str(pick(raw, 'title')),
    content: str(pick(raw, 'content', 'message', 'body')),
    type: mapType(raw),
    isRead: Boolean(pick(raw, 'isRead', 'read')),
    createdAt: str(pick(raw, 'createdAt'), new Date().toISOString()),
  };
}
