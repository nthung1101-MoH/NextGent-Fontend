import { NotificationItem } from '../types/notification';
import { apiClient } from './apiClient';
import { hasSession, mockFallbackEnabled, unwrapData, warnFallback } from './apiHelpers';
import { mapNotification } from './mappers/notificationMapper';
import { listOf, totalPagesOf } from './mappers/utils';

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

const PAGE_SIZE = 50;
const MAX_PAGES = 5;
// Id cac thong bao chua doc o lan tai gan nhat tu API (API chua co endpoint "doc tat ca" nen duyet tung id)
let unreadIdsFromApi: number[] = [];

const saveNotifications = (items: NotificationItem[]) => {
  try {
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving notifications', err);
  }
};

/**
 * Trung tâm Thông báo. THEO ĐẶC TẢ (backend chưa có NotificationsController; spec 13.3 / 13.4 chỉ có một dòng mô tả):
 * - 13.3 GET   /notifications            -> getNotifications (khi có phiên đăng nhập thật)
 * - 13.4 PATCH /notifications/{id}/read  -> markAsRead, markAllAsRead (gọi 13.4 cho từng thông báo chưa đọc)
 * - Chưa có API xóa / tạo thông báo: deleteNotification và createNotification vẫn dùng dữ liệu mẫu cục bộ.
 * Không có phiên đăng nhập thật (đăng nhập mẫu) hoặc backend lỗi + VITE_ENABLE_MOCK_FALLBACK -> dữ liệu mẫu.
 */
export const notificationService = {
  async getNotifications(userId: number): Promise<NotificationItem[]> {
    if (hasSession()) {
      try {
        const rows: NotificationItem[] = [];
        for (let page = 1; page <= MAX_PAGES; page++) {
          const res = await apiClient.get('/notifications', { params: { page, size: PAGE_SIZE } });
          const body = unwrapData(res.data);
          rows.push(...listOf(body).map(mapNotification));
          if (page >= totalPagesOf(body)) break;
        }
        const items = rows
          .map((n) => ({ ...n, userId: n.userId || userId }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        unreadIdsFromApi = items.filter((n) => !n.isRead).map((n) => n.notificationId);
        return items;
      } catch (e) {
        if (!mockFallbackEnabled()) throw e;
        warnFallback('getNotifications', e);
      }
    }
    // Giả lập network latency 100ms
    await new Promise(r => setTimeout(r, 100));
    const all = getStoredNotifications();
    return all.filter(n => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async markAsRead(notificationId: number): Promise<boolean> {
    if (hasSession()) {
      try {
        await apiClient.patch(`/notifications/${notificationId}/read`);
        unreadIdsFromApi = unreadIdsFromApi.filter((id) => id !== notificationId);
        return true;
      } catch (e) {
        if (!mockFallbackEnabled()) throw e;
        warnFallback('markAsRead', e);
      }
    }
    const all = getStoredNotifications();
    const updated = all.map(n => n.notificationId === notificationId? {...n, isRead: true }: n);
    saveNotifications(updated);
    return true;
  },

  async markAllAsRead(userId: number): Promise<boolean> {
    if (hasSession() && unreadIdsFromApi.length > 0) {
      const ids = [...unreadIdsFromApi];
      const results = await Promise.allSettled(ids.map((id) => apiClient.patch(`/notifications/${id}/read`)));
      unreadIdsFromApi = ids.filter((_, i) => results[i].status === 'rejected');
      if (unreadIdsFromApi.length === 0) return true;
      if (!mockFallbackEnabled()) throw new Error('Không thể đánh dấu đã đọc toàn bộ thông báo.');
      warnFallback('markAllAsRead', results.find((r) => r.status === 'rejected'));
    }
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
