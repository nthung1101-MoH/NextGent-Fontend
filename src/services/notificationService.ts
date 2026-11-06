import { NotificationItem } from '../types/notification';

// Mock seed notifications for demo and development
// Phân tách theo userId để bảo mật và toàn vẹn dữ liệu
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    notificationId: 1,
    userId: 101, // Trần Thị Thu Huyền
    orderId: 1001,
    orderCode: 'ORD2026102101',
    title: 'Đơn hàng đang trên đường giao đến bạn!',
    content: 'Bưu kiện đơn hàng #ORD2026102101 (iPhone 15 Pro Max) đã xuất kho và bàn giao cho Đơn vị vận chuyển Giao Hàng Nhanh.',
    type: 'ORDER',
    isRead: false,
    createdAt: '2026-10-27T08:30:00Z',
  },
  {
    notificationId: 2,
    userId: 101,
    orderId: 1002,
    orderCode: 'ORD2026102202',
    title: 'Đặt hàng thành công & Đã xác nhận',
    content: 'Đơn hàng #ORD2026102202 (Samsung Galaxy S24 Ultra) đã được hệ thống ghi nhận thành công và chuyển sang bộ phận đóng gói.',
    type: 'ORDER',
    isRead: false,
    createdAt: '2026-10-26T14:15:00Z',
  },
  {
    notificationId: 3,
    userId: 101,
    title: 'Siêu sale cuối tháng — Giảm thêm 500.000đ',
    content: 'Nhập mã NEXTGEN500 khi mua các dòng Flagship Apple & Samsung để nhận ưu đãi giảm trực tiếp 500.000đ.',
    type: 'PROMO',
    isRead: true,
    createdAt: '2026-10-25T10:00:00Z',
  },
  {
    notificationId: 4,
    userId: 101,
    title: 'Chào mừng bạn đến với NextGen Smart Tech',
    content: 'Tài khoản của bạn đã được kích hoạt thành công. Khám phá các chính sách bảo hành 12 tháng chính hãng và đổi trả 30 ngày.',
    type: 'SYSTEM',
    isRead: true,
    createdAt: '2026-10-20T08:00:00Z',
  },
  {
    notificationId: 5,
    userId: 102, // Staff
    title: 'Thông báo nội bộ hệ thống kho',
    content: 'Cập nhật định mức tồn kho an toàn cho dòng iPhone 15 Pro Max và iPad Pro M4.',
    type: 'SYSTEM',
    isRead: false,
    createdAt: '2026-10-27T07:00:00Z',
  },
  {
    notificationId: 6,
    userId: 103, // Admin
    title: 'Báo cáo doanh thu & Kiểm toán tuần 43',
    content: 'Báo cáo kiểm kê kho đã sẵn sàng để phê duyệt trong phân hệ Quản trị.',
    type: 'SYSTEM',
    isRead: false,
    createdAt: '2026-10-27T06:30:00Z',
  }
];

const STORAGE_NOTIF_KEY = 'nextpick_notifications_v1';

const getStoredNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_NOTIF_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

const saveNotifications = (items: NotificationItem[]) => {
  try {
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving notifications', err);
  }
};

/**
 * Service Abstraction cho Trung tâm Thông báo (Notifications Center)
 * Hỗ trợ mock adapter và sẵn sàng chuyển đổi RESTful API:
 * - GET    /api/notifications
 * - PATCH  /api/notifications/:id/read
 * - PATCH  /api/notifications/read-all
 * - DELETE /api/notifications/:id
 */
export const notificationService = {
  async getNotifications(userId: number): Promise<NotificationItem[]> {
    // Giả lập network latency 100ms
    await new Promise(r => setTimeout(r, 100));
    const all = getStoredNotifications();
    return all.filter(n => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async markAsRead(notificationId: number): Promise<boolean> {
    const all = getStoredNotifications();
    const updated = all.map(n => n.notificationId === notificationId? {...n, isRead: true }: n);
    saveNotifications(updated);
    return true;
  },

  async markAllAsRead(userId: number): Promise<boolean> {
    const all = getStoredNotifications();
    const updated = all.map(n => n.userId === userId? {...n, isRead: true }: n);
    saveNotifications(updated);
    return true;
  },

  async deleteNotification(notificationId: number): Promise<boolean> {
    const all = getStoredNotifications();
    const updated = all.filter(n => n.notificationId!== notificationId);
    saveNotifications(updated);
    return true;
  },

  async createNotification(notif: Omit<NotificationItem, 'notificationId' | 'createdAt' | 'isRead'>): Promise<NotificationItem> {
    const all = getStoredNotifications();
    const newItem: NotificationItem = {...notif,
      notificationId: Date.now(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    all.unshift(newItem);
    saveNotifications(all);
    return newItem;
  }
};
