import type { PortalReturnRequest, ReturnRequestStatus } from '../../types/portal';
import { asRec, listOf, num, optNum, pick, str, type Rec } from './utils';

/**
 * THEO DAC TA: backend chua co controller doi tra (chi co entity ReturnRequest). Ten truong duoc doc linh hoat
 * (phang hoac long trong order / requestedBy) de khi backend chot, chi can sua file nay.
 */
const KNOWN: ReturnRequestStatus[] = ['PENDING', 'INSPECTING', 'APPROVED', 'REJECTED', 'REFUNDED'];

export function mapReturnStatus(raw: unknown): ReturnRequestStatus {
  const v = str(raw).toUpperCase().replace(/[\s-]+/g, '_');
  switch (v) {
    case 'REQUESTED':
    case 'SUBMITTED':
    case 'OPEN':
    case 'WAITING':
      return 'PENDING';
    case 'IN_INSPECTION':
    case 'RECEIVED':
      return 'INSPECTING';
    case 'COMPLETED':
    case 'REFUND_COMPLETED':
      return 'REFUNDED';
    case 'CANCELED':
    case 'CANCELLED':
      return 'REJECTED';
    default:
      if ((KNOWN as string[]).includes(v)) return v as ReturnRequestStatus;
      if (import.meta.env?.DEV) console.warn(`[adminReturnMapper] Trang thai doi tra khong nhan ra: "${str(raw)}"`);
      return 'PENDING';
  }
}

const optStr = (v: unknown): string | undefined => (v === undefined ? undefined : str(v));

export function mapPortalReturn(raw: Rec): PortalReturnRequest {
  const order = asRec(pick(raw, 'order'));
  const reqBy = pick(raw, 'requestedBy');
  const reqByRec = asRec(reqBy);
  const inspBy = pick(raw, 'inspectedBy');
  const inspByRec = asRec(inspBy);
  return {
    returnId: num(pick(raw, 'returnId', 'id')),
    orderId: num(pick(raw, 'orderId') ?? pick(order, 'orderId')),
    orderCode: str(pick(raw, 'orderCode') ?? pick(order, 'orderCode')),
    userId: num(pick(raw, 'userId') ?? pick(reqByRec, 'userId')),
    requestedBy: str(pick(raw, 'requestedByName', 'customerName', 'recipientName') ?? pick(reqByRec, 'fullName') ?? (reqByRec ? undefined : reqBy)),
    phone: str(pick(raw, 'phone', 'customerPhone', 'recipientPhone') ?? pick(reqByRec, 'phone') ?? pick(order, 'recipientPhone')),
    reason: str(pick(raw, 'reason')),
    status: mapReturnStatus(pick(raw, 'status')),
    inspectionResult: optStr(pick(raw, 'inspectionResult', 'adminNote')),
    inspectedBy: optStr(pick(raw, 'inspectedByName') ?? pick(inspByRec, 'fullName') ?? (inspByRec ? undefined : inspBy)),
    inspectedAt: optStr(pick(raw, 'inspectedAt')),
    refundAmount: optNum(pick(raw, 'refundAmount')),
    rejectReason: optStr(pick(raw, 'rejectReason')),
    createdAt: str(pick(raw, 'createdAt')),
    items: listOf(pick(raw, 'items')).map((i) => ({
      productName: str(pick(i, 'productName', 'productNameSnapshot')),
      sku: str(pick(i, 'sku', 'skuSnapshot')),
      quantity: num(pick(i, 'quantity'), 1),
      unitPrice: num(pick(i, 'unitPrice')),
    })),
  };
}

/** 11.3 - ket qua kiem dinh MB04 (dac ta muc VIII.8.1). */
export interface AdminInspectResult {
  returnId: number;
  status: ReturnRequestStatus;
  formCode: string;
  refundAmount?: number;
  inventoryRestocked: boolean;
}

export function mapInspectResult(raw: Rec): AdminInspectResult {
  return {
    returnId: num(pick(raw, 'returnId', 'id')),
    status: mapReturnStatus(pick(raw, 'status')),
    formCode: str(pick(raw, 'formCode')),
    refundAmount: optNum(pick(raw, 'refundAmount')),
    inventoryRestocked: pick(raw, 'inventoryRestocked') === true,
  };
}
