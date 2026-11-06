export type NotificationType = 'ORDER' | 'PROMO' | 'SYSTEM';

export interface NotificationItem {
  notificationId: number;
  userId: number;
  orderId?: number;
  orderCode?: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
