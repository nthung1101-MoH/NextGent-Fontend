import type { OrderDetail, OrderStatus } from '../../types/order';
import type { ShipmentStatus } from '../../types/portal';
import { fromApiPaymentMethod, mapOrderStatus, toPaymentStatus } from './orderMapper';
import { mapAdminPage, type AdminPage } from './adminCommonMapper';
import { mapShipmentStatus } from './shipmentMapper';
import { asRec, listOf, num, optNum, pick, str, type Rec } from './utils';

/** Mot dong trong danh sach don cua trang quan tri (AdminOrderItemResponse). */
export interface AdminOrderRow {
  orderId: number;
  orderCode: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: 'COD' | 'SIMULATED_TRANSFER';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  totalAmount: number;
  status: OrderStatus;
  carrier?: string;
  trackingCode?: string;
  /** Chuoi tom tat san pham backend tra ve (vd "iPhone 15 x1, ..."); khong co danh sach chi tiet. */
  itemsSummary: string;
  createdAt: string;
}

export interface AdminPipelineSummary {
  pendingPayment: number;
  waitingConfirmation: number;
  confirmed: number;
  preparing: number;
  shipping: number;
  completed: number;
  cancelled: number;
}

export interface AdminOrderPage extends AdminPage<AdminOrderRow> {
  pipelineSummary: AdminPipelineSummary;
}

export function mapAdminOrderRow(raw: Rec): AdminOrderRow {
  const carrier = pick(raw, 'carrier');
  const tracking = pick(raw, 'trackingCode');
  return {
    orderId: num(pick(raw, 'orderId', 'id')),
    orderCode: str(pick(raw, 'orderCode')),
    recipientName: str(pick(raw, 'recipientName')),
    recipientPhone: str(pick(raw, 'recipientPhone')),
    shippingAddress: str(pick(raw, 'shippingAddress')),
    paymentMethod: fromApiPaymentMethod(pick(raw, 'paymentMethod')),
    paymentStatus: toPaymentStatus(pick(raw, 'paymentStatus')),
    totalAmount: num(pick(raw, 'totalAmount')),
    status: mapOrderStatus(pick(raw, 'status')),
    carrier: carrier === undefined ? undefined : str(carrier),
    trackingCode: tracking === undefined ? undefined : str(tracking),
    itemsSummary: str(pick(raw, 'itemsSummary')),
    createdAt: str(pick(raw, 'createdAt')),
  };
}

export function mapPipelineSummary(raw: unknown): AdminPipelineSummary {
  const r = asRec(raw);
  const n = (k: string) => num(pick(r, k), 0);
  return {
    pendingPayment: n('pendingPayment'),
    waitingConfirmation: n('waitingConfirmation'),
    confirmed: n('confirmed'),
    preparing: n('preparing'),
    shipping: n('shipping'),
    completed: n('completed'),
    cancelled: n('cancelled'),
  };
}

export function mapAdminOrderPage(data: unknown): AdminOrderPage {
  return { ...mapAdminPage(data, mapAdminOrderRow), pipelineSummary: mapPipelineSummary(pick(asRec(data), 'pipelineSummary')) };
}

/** Du lieu mau: OrderDetail (sharedStore) -> dong quan tri. */
export function orderDetailToAdminRow(o: OrderDetail): AdminOrderRow {
  return {
    orderId: o.orderId,
    orderCode: o.orderCode,
    recipientName: o.recipientName,
    recipientPhone: o.recipientPhone,
    shippingAddress: o.shippingAddress,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    totalAmount: o.totalAmount,
    status: o.status,
    carrier: o.carrier,
    trackingCode: o.trackingCode,
    itemsSummary: o.items.map((i) => `${i.productNameSnapshot} x${i.quantity}`).join(', '),
    createdAt: o.createdAt,
  };
}

export function summarizePipeline(rows: { status: OrderStatus }[]): AdminPipelineSummary {
  const c = (s: OrderStatus) => rows.filter((r) => r.status === s).length;
  return {
    pendingPayment: c('PENDING_PAYMENT'),
    waitingConfirmation: c('WAITING_CONFIRMATION'),
    confirmed: c('CONFIRMED'),
    preparing: c('PREPARING') + c('PICKED_UP'),
    shipping: c('SHIPPING'),
    completed: c('COMPLETED'),
    cancelled: c('CANCELLED'),
  };
}

// ---------- 8.6 xac nhan don / 8.7 dong goi xuat kho ----------
export interface AdminShipmentInfo {
  shipmentId: number;
  trackingCode: string;
  carrier: string;
  status: ShipmentStatus;
  recipientName: string;
  recipientPhone: string;
  codAmount: number;
}

function mapShipmentInfo(raw: unknown): AdminShipmentInfo | undefined {
  const r = asRec(raw);
  if (!r) return undefined;
  return {
    shipmentId: num(pick(r, 'shipmentId', 'id')),
    trackingCode: str(pick(r, 'trackingCode')),
    carrier: str(pick(r, 'carrier')),
    status: mapShipmentStatus(pick(r, 'status', 'shipmentStatus')),
    recipientName: str(pick(r, 'recipientName')),
    recipientPhone: str(pick(r, 'recipientPhone')),
    codAmount: num(pick(r, 'codAmount')),
  };
}

export interface AdminConfirmResult {
  orderId?: number;
  orderCode: string;
  status: OrderStatus;
  formCode: string;
  shipment?: AdminShipmentInfo;
  confirmedBy?: string;
  confirmedAt?: string;
}

export function mapConfirmOrderResult(raw: Rec): AdminConfirmResult {
  const by = pick(raw, 'confirmedBy');
  const at = pick(raw, 'confirmedAt');
  return {
    orderId: optNum(pick(raw, 'orderId')),
    orderCode: str(pick(raw, 'orderCode')),
    status: mapOrderStatus(pick(raw, 'orderStatus', 'status')),
    formCode: str(pick(raw, 'formCode')),
    shipment: mapShipmentInfo(pick(raw, 'shipment')),
    confirmedBy: by === undefined ? undefined : str(by),
    confirmedAt: at === undefined ? undefined : str(at),
  };
}

export interface AdminPackExportResult {
  orderId?: number;
  orderCode: string;
  status: OrderStatus;
  formCode: string;
  inventoryDeducted: boolean;
  exportedItems: { sku: string; quantity: number; remainingOnHand: number }[];
  shipment?: AdminShipmentInfo;
  exportedBy?: string;
  exportedAt?: string;
}

export function mapPackExportResult(raw: Rec): AdminPackExportResult {
  const by = pick(raw, 'exportedBy');
  const at = pick(raw, 'exportedAt');
  return {
    orderId: optNum(pick(raw, 'orderId')),
    orderCode: str(pick(raw, 'orderCode')),
    status: mapOrderStatus(pick(raw, 'orderStatus', 'status')),
    formCode: str(pick(raw, 'formCode')),
    inventoryDeducted: pick(raw, 'inventoryDeducted') === true,
    exportedItems: listOf(pick(raw, 'exportedItems')).map((i) => ({
      sku: str(pick(i, 'sku')),
      quantity: num(pick(i, 'quantity')),
      remainingOnHand: num(pick(i, 'remainingOnHand')),
    })),
    shipment: mapShipmentInfo(pick(raw, 'shipment')),
    exportedBy: by === undefined ? undefined : str(by),
    exportedAt: at === undefined ? undefined : str(at),
  };
}
