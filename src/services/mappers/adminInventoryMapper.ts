// Mapper cho API quản trị kho (5.1-5.5). Nguồn: AdminInventoriesController + DTO trong dto/portal/*/inventory.
import type { PortalInventoryItem, StockAdjustmentRecord, StockMovementRecord } from '../../types/portal';
import { formatLocalDateTime } from './adminCommon';
import { asRec, listOf, num, optNum, pick, str, type Rec } from './utils';

export type StockStatus = PortalInventoryItem['status'];
export type MovementType = StockMovementRecord['txnType'];

export interface InventorySummary {
  totalOnHand: number;
  totalReserved: number;
  totalAvailable: number;
  lowStockCount: number;
}

/** 5.2: chi tiết một SKU (mở rộng từ dòng tồn kho). */
export interface AdminInventoryDetail extends PortalInventoryItem {
  inventoryId?: number;
  ramGb?: number;
  connectionType?: string;
  listPrice?: number;
  updatedAt: string;
  recentTransactions: StockMovementRecord[];
}

/** 5.5: cảnh báo sắp hết hàng. */
export interface LowStockAlert {
  variantId: number;
  productId: number;
  productName: string;
  sku: string;
  color: string;
  onHandQty: number;
  reservedQty: number;
  availableQty: number;
  minThreshold: number;
  deficit: number;
  status: StockStatus;
  recommendImportQty: number;
}

const STATUSES: StockStatus[] = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'];
const TYPES: MovementType[] = ['EXPORT', 'RETURN', 'ADJUST', 'IMPORT'];

function stockStatus(raw: unknown, available: number, threshold: number): StockStatus {
  const s = str(raw).toUpperCase() as StockStatus;
  if (STATUSES.includes(s)) return s;
  if (available <= 0) return 'OUT_OF_STOCK';
  return available <= threshold ? 'LOW_STOCK' : 'IN_STOCK';
}

/** Backend ghi loại giao dịch kiểm kê là "ADJUSTMENT"; giao diện dùng "ADJUST". Giá trị lạ cũng quy về ADJUST. */
function movementType(raw: unknown): MovementType {
  const s = str(raw).toUpperCase();
  if (s === 'ADJUSTMENT') return 'ADJUST';
  return TYPES.includes(s as MovementType) ? (s as MovementType) : 'ADJUST';
}

/** InventoryItemResponse -> PortalInventoryItem. */
export function mapAdminInventoryItem(r: Rec): PortalInventoryItem {
  const onHand = num(pick(r, 'onHandQty'));
  const reserved = num(pick(r, 'reservedQty'));
  const available = num(pick(r, 'availableQty'), onHand - reserved);
  const threshold = num(pick(r, 'minThreshold'));
  return {
    variantId: num(pick(r, 'variantId')),
    productId: num(pick(r, 'productId')),
    productName: str(pick(r, 'productName')),
    sku: str(pick(r, 'sku')),
    color: str(pick(r, 'color')),
    romGb: num(pick(r, 'romGb')),
    onHandQty: onHand,
    reservedQty: reserved,
    availableQty: available,
    minThreshold: threshold,
    status: stockStatus(pick(r, 'status'), available, threshold),
  };
}

/** InventoryTransactionItemResponse -> StockMovementRecord (orderId không có trong kiểu giao diện nên bỏ qua). */
export function mapAdminMovement(r: Rec): StockMovementRecord {
  return {
    txnId: num(pick(r, 'txnId', 'id')),
    formCode: str(pick(r, 'formCode')),
    sku: str(pick(r, 'sku')),
    productName: str(pick(r, 'productName')),
    txnType: movementType(pick(r, 'txnType')),
    quantityChange: num(pick(r, 'quantityChange')),
    qtyBefore: num(pick(r, 'qtyBefore')),
    qtyAfter: num(pick(r, 'qtyAfter')),
    reason: str(pick(r, 'reason')),
    performedBy: str(pick(r, 'performedBy')),
    performedAt: formatLocalDateTime(pick(r, 'performedAt')),
  };
}

/** InventoryAdjustmentResponse -> StockAdjustmentRecord (phiếu kiểm kê MB05). */
export function mapAdminAdjustment(r: Rec): StockAdjustmentRecord {
  const before = num(pick(r, 'qtyBefore'));
  const actual = num(pick(r, 'qtyActual'));
  return {
    id: num(pick(r, 'adjustmentId', 'id')),
    formCode: str(pick(r, 'formCode')),
    sku: str(pick(r, 'sku')),
    productName: str(pick(r, 'productName')),
    qtySystem: before,
    qtyActual: actual,
    qtyDiff: num(pick(r, 'quantityChange'), actual - before),
    reason: str(pick(r, 'reason')),
    performedBy: str(pick(r, 'performedBy')),
    createdAt: formatLocalDateTime(pick(r, 'performedAt')),
    status: 'APPROVED',
  };
}

export function mapInventorySummary(v: unknown): InventorySummary {
  const r = asRec(v);
  return {
    totalOnHand: num(pick(r, 'totalOnHand')),
    totalReserved: num(pick(r, 'totalReserved')),
    totalAvailable: num(pick(r, 'totalAvailable')),
    lowStockCount: num(pick(r, 'lowStockCount')),
  };
}

/** AdminInventoryDetailResponse -> AdminInventoryDetail. */
export function mapAdminInventoryDetail(r: Rec): AdminInventoryDetail {
  return {
    ...mapAdminInventoryItem(r),
    inventoryId: optNum(pick(r, 'inventoryId')),
    ramGb: optNum(pick(r, 'ramGb')),
    connectionType: str(pick(r, 'connectionType')) || undefined,
    listPrice: optNum(pick(r, 'listPrice')),
    updatedAt: formatLocalDateTime(pick(r, 'updatedAt')),
    recentTransactions: listOf(pick(r, 'recentTransactions')).map(mapAdminMovement),
  };
}

/** LowStockItemResponse -> LowStockAlert. */
export function mapLowStockAlert(r: Rec): LowStockAlert {
  const available = num(pick(r, 'availableQty'));
  const threshold = num(pick(r, 'minThreshold'));
  return {
    variantId: num(pick(r, 'variantId')),
    productId: num(pick(r, 'productId')),
    productName: str(pick(r, 'productName')),
    sku: str(pick(r, 'sku')),
    color: str(pick(r, 'color')),
    onHandQty: num(pick(r, 'onHandQty')),
    reservedQty: num(pick(r, 'reservedQty')),
    availableQty: available,
    minThreshold: threshold,
    deficit: num(pick(r, 'deficit')),
    status: stockStatus(pick(r, 'status'), available, threshold),
    recommendImportQty: num(pick(r, 'recommendImportQty')),
  };
}
