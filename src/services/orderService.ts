import { apiClient } from './apiClient';
import { CreateOrderPayload, OrderResponse, OrderDetail } from '../types/order';
import { sharedStore } from './sharedStore';
import { hasSession, httpStatus, isBackendDown, mockFallbackEnabled, serverMessage, unwrapData, warnFallback } from './apiHelpers';
import { isMissingEndpoint } from './mappers/adminCommonMapper';
import { mapOrderDetail, mapOrderResponse, toApiPaymentMethod } from './mappers/orderMapper';
import { mapShipmentTracking, type ShipmentTracking } from './mappers/shipmentMapper';
import { asRec, listOf, totalPagesOf } from './mappers/utils';
import { paymentService } from './paymentService';

/**
 * Don hang phia khach hang. Nguon: BACKEND (OrdersController, ShipmentsController); doi tra (11.1) THEO DAC TA.
 * Chu ky cac ham cu giu nguyen. Du lieu mau (sharedStore) chi dung khi chua dang nhap hoac backend chua san sang
 * (VITE_ENABLE_MOCK_FALLBACK != false); loi nghiep vu cua backend duoc nem ra / tra ve de giao dien hien thong bao.
 */
const PAGE_SIZE = 50;
const MAX_PAGES = 10;
const PHONE_SCAN_LIMIT = 10;   // tra cuu theo SDT: toi da so don gan nhat duoc doc chi tiet

// orderId -> orderCode: backend huy don / xem don theo orderCode, trong khi giao dien truyen orderId.
const codeById = new Map<number, string>();
const remember = (o: { orderId: number; orderCode: string }): void => { if (o.orderId && o.orderCode) codeById.set(o.orderId, o.orderCode); };

/** Mat ket noi that (khong co phan hoi tu may chu). 5xx KHONG tinh la offline vi server co the da ghi du lieu. */
const isOffline = (e: unknown): boolean => httpStatus(e) === 0;

const normalizeCode = (c: string): string => c.trim().toUpperCase().replace('#', '');

async function fetchMyOrders(): Promise<OrderDetail[]> {
  const rows: OrderDetail[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await apiClient.get('/orders/my-orders', { params: { page, size: PAGE_SIZE, status: 'ALL' } });
    const data = unwrapData(res.data);
    rows.push(...listOf(data).map(mapOrderDetail));
    if (page >= totalPagesOf(data)) break;
  }
  rows.forEach(remember);
  return rows;
}

/** Chi tiet 1 don theo ma; 400/403/404 (khong co / khong thuoc ve nguoi dung) -> null. */
async function fetchDetail(code: string): Promise<OrderDetail | null> {
  try {
    const res = await apiClient.get(`/orders/${encodeURIComponent(code)}`);
    const d = mapOrderDetail(asRec(unwrapData(res.data)) ?? {});
    remember(d);
    return d;
  } catch (e) {
    if ([400, 403, 404].includes(httpStatus(e))) return null;
    throw e;
  }
}

async function trackFromApi(code: string, phone?: string): Promise<OrderDetail | null> {
  if (code) {
    const exact = await fetchDetail(code);
    if (exact) return exact;
  }
  const list = await fetchMyOrders();
  const byCode = code ? list.find((o) => o.orderCode.toUpperCase().includes(code)) : undefined;
  if (byCode) return (await fetchDetail(byCode.orderCode)) ?? byCode;
  const p = phone?.trim();
  if (p) {
    // Danh sach don khong tra SDT nguoi nhan, nen doc chi tiet cac don gan nhat de doi chieu.
    for (const o of list.slice(0, PHONE_SCAN_LIMIT)) {
      const d = await fetchDetail(o.orderCode);
      if (d && d.recipientPhone.includes(p)) return d;
    }
  }
  return null;
}

function mockTrack(orderCode: string, phone?: string): OrderDetail | null {
  const trimmed = orderCode.trim().toUpperCase().replace('#', '');
  const orders = sharedStore.getOrders();
  const found = orders.find(o =>
    o.orderCode.toUpperCase().includes(trimmed) ||
    (phone && o.recipientPhone.includes(phone.trim()))
  );
  return found || null;
}

function mockRequestReturn(orderId: number, reason: string): { success: boolean; message: string } {
  const order = sharedStore.getOrderById(orderId);
  if (!order) return { success: false, message: 'Không tìm thấy đơn hàng' };
  if (order.status !== 'COMPLETED') {
    return { success: false, message: 'Chỉ có thể yêu cầu đổi trả với đơn hàng đã Hoàn tất.' };
  }

  order.statusHistory.unshift({
    status: 'COMPLETED',
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
    note: `Khách hàng gửi yêu cầu Đổi trả / Hoàn tiền: ${reason}. Bộ phận CSKH đang xử lý.`
  });

  // Tạo bản ghi trong Bảng Return_Requests (Bảng 21)
  sharedStore.createReturnRequest({
    orderId: order.orderId,
    orderCode: order.orderCode,
    userId: 101,
    requestedBy: order.recipientName,
    phone: order.recipientPhone,
    reason: reason,
    items: order.items.map(it => ({
      productName: it.productNameSnapshot,
      sku: it.skuSnapshot,
      quantity: it.quantity,
      unitPrice: it.unitPrice
    }))
  });

  return {
    success: true,
    message: 'Yêu cầu đổi trả của bạn đã được ghi nhận. Nhân viên CSKH sẽ liên hệ trong vòng 24h để hướng dẫn gửi máy về kho kiểm tra!'
  };
}

export const orderService = {
  // 8.1 Tạo đơn hàng & Kích hoạt cơ chế Giữ chỗ tồn kho.
  // COD và tạo payment intent là hai bước riêng: đơn được tạo trước, intent (chỉ với chuyển khoản) tạo sau;
  // intent lỗi KHÔNG làm mất đơn đã tạo và không tạo lại đơn.
  async createOrder(payload: CreateOrderPayload, userRole = 'CUSTOMER', userName = 'Khách hàng'): Promise<OrderResponse> {
    if (!hasSession() && mockFallbackEnabled()) return sharedStore.createOrder(payload, userRole, userName);

    let created: OrderResponse;
    try {
      const res = await apiClient.post('/orders', {
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        shippingAddress: payload.shippingAddress,
        paymentMethod: toApiPaymentMethod(payload.paymentMethod),
        note: payload.note,
        voucherCode: payload.voucherCode,
        items: payload.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });
      created = mapOrderResponse(asRec(unwrapData(res.data)) ?? {}, payload.paymentMethod);
    } catch (e) {
      if (mockFallbackEnabled() && isOffline(e)) {
        warnFallback('POST /orders', e);
        return sharedStore.createOrder(payload, userRole, userName);
      }
      throw new Error(serverMessage(e, 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!'));
    }
    remember(created);

    if (payload.paymentMethod === 'SIMULATED_TRANSFER') {
      try {
        const intent = await paymentService.createIntent({ orderId: created.orderId, paymentMethod: 'BANK_TRANSFER' });
        if (intent.expiresAt) created = { ...created, paymentDeadline: intent.expiresAt };
      } catch (e) {
        warnFallback('POST /payments/intent (don da tao, giu nguyen)', e);
      }
    }
    return created;
  },

  // 8.3 Tra cứu đơn hàng theo mã đơn hoặc SĐT (backend chỉ tra theo mã đơn của chính người dùng)
  async trackOrder(orderCode: string, phone?: string): Promise<OrderDetail | null> {
    if (!hasSession() && mockFallbackEnabled()) return mockTrack(orderCode, phone);
    try {
      return await trackFromApi(normalizeCode(orderCode), phone);
    } catch (e) {
      if (mockFallbackEnabled() && isBackendDown(e)) {
        warnFallback('GET /orders/{orderCode}', e);
        return mockTrack(orderCode, phone);
      }
      warnFallback('GET /orders/{orderCode} (khong nem loi de giao dien khong treo)', e);
      return null;
    }
  },

  // 8.2 Lấy danh sách đơn hàng của tài khoản đang đăng nhập
  async getAllOrders(): Promise<OrderDetail[]> {
    if (!hasSession() && mockFallbackEnabled()) return sharedStore.getOrders();
    try {
      return await fetchMyOrders();
    } catch (e) {
      if (mockFallbackEnabled() && isBackendDown(e)) {
        warnFallback('GET /orders/my-orders', e);
        return sharedStore.getOrders();
      }
      warnFallback('GET /orders/my-orders (tra danh sach rong)', e);
      return [];
    }
  },

  // 8.4 Khách hàng tự hủy đơn khi còn ở trạng thái Chờ xác nhận hoặc Chờ thanh toán
  async cancelOrder(orderId: number, reason: string, performedBy = 'Khách hàng'): Promise<boolean> {
    if (!hasSession() && mockFallbackEnabled()) return sharedStore.cancelOrder(orderId, reason, performedBy);
    try {
      let code = codeById.get(orderId);
      if (!code) {
        await fetchMyOrders();
        code = codeById.get(orderId);
      }
      if (!code) return false;
      await apiClient.post(`/orders/${encodeURIComponent(code)}/cancel`, { reason });
      return true;
    } catch (e) {
      if (mockFallbackEnabled() && isOffline(e)) {
        warnFallback('POST /orders/{orderCode}/cancel', e);
        return sharedStore.cancelOrder(orderId, reason, performedBy);
      }
      warnFallback('POST /orders/{orderCode}/cancel (khong huy duoc)', e);
      return false;
    }
  },

  // 11.1 Yêu cầu đổi trả trong 7 ngày sau khi đơn hoàn tất. THEO ĐẶC TẢ (backend chưa có controller đổi trả).
  async requestReturn(orderId: number, reason: string): Promise<{ success: boolean; message: string }> {
    if (!hasSession() && mockFallbackEnabled()) return mockRequestReturn(orderId, reason);
    try {
      await apiClient.post('/returns', { orderId, reason });
      return { success: true, message: 'Đã gửi yêu cầu đổi trả thành công!' };
    } catch (e) {
      if (mockFallbackEnabled() && (isOffline(e) || isMissingEndpoint(e))) {
        warnFallback('POST /returns', e);
        return mockRequestReturn(orderId, reason);
      }
      return { success: false, message: serverMessage(e, 'Không thể gửi yêu cầu đổi trả. Vui lòng thử lại!') };
    }
  },

  // 9.1 Tra cứu vận đơn công khai theo mã vận đơn (không cần đăng nhập). 404 -> null.
  async trackShipment(trackingCode: string): Promise<ShipmentTracking | null> {
    try {
      const res = await apiClient.get(`/shipments/track/${encodeURIComponent(trackingCode.trim())}`);
      return mapShipmentTracking(asRec(unwrapData(res.data)) ?? {});
    } catch (e) {
      if (httpStatus(e) === 404) return null;
      throw new Error(serverMessage(e, 'Không thể tra cứu vận đơn.'));
    }
  }
};
