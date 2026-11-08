import type { PortalPromotion, PortalPromotionVariant, PortalVoucher, PromotionStatus } from '../../types/portal';
import { listOf, num, optNum, pick, str, type Rec } from './utils';

const discountTypeOf = (v: unknown): 'FIXED' | 'PERCENT' => (str(v).toUpperCase() === 'PERCENT' ? 'PERCENT' : 'FIXED');

/**
 * ValidVoucherResponse (GET /vouchers/valid) -> PortalVoucher.
 * Backend KHONG tra startAt va isActive: danh sach "valid" chi gom ma dang hieu luc nen isActive = true, startAt = ''.
 * usageLimit = null (khong gioi han) -> Number.MAX_SAFE_INTEGER de dieu kien `usedCount >= usageLimit` cua giao dien khong chan.
 */
export function mapVoucher(raw: Rec): PortalVoucher {
  const limit = optNum(pick(raw, 'usageLimit'));
  const max = optNum(pick(raw, 'maxDiscount'));
  return {
    voucherId: num(pick(raw, 'voucherId', 'id')),
    code: str(pick(raw, 'code')).toUpperCase(),
    discountType: discountTypeOf(pick(raw, 'discountType')),
    discountValue: num(pick(raw, 'discountValue')),
    maxDiscount: max !== undefined && max > 0 ? max : undefined,
    minOrderValue: num(pick(raw, 'minOrderValue')),
    usageLimit: limit ?? Number.MAX_SAFE_INTEGER,
    usedCount: num(pick(raw, 'usedCount')),
    startAt: str(pick(raw, 'startAt')),
    expiredAt: str(pick(raw, 'expiredAt', 'endAt')),
    isActive: pick(raw, 'isActive') === undefined ? true : Boolean(pick(raw, 'isActive')),
  };
}

/** ApplyVoucherResponse (POST /vouchers/apply). */
export interface AppliedVoucher {
  voucherId: number;
  code: string;
  discountType: 'FIXED' | 'PERCENT';
  discountValue: number;
  discountAmount: number;
  originalSubtotal: number;
  finalSubtotal: number;
}

export function mapAppliedVoucher(raw: Rec): AppliedVoucher {
  return {
    voucherId: num(pick(raw, 'voucherId')),
    code: str(pick(raw, 'code')).toUpperCase(),
    discountType: discountTypeOf(pick(raw, 'discountType')),
    discountValue: num(pick(raw, 'discountValue')),
    discountAmount: num(pick(raw, 'discountAmount')),
    originalSubtotal: num(pick(raw, 'originalSubtotal')),
    finalSubtotal: num(pick(raw, 'finalSubtotal')),
  };
}

const PROMO_STATUSES: PromotionStatus[] = ['ACTIVE', 'UPCOMING', 'PAUSED', 'ENDED'];

/**
 * ActivePromotionResponse (GET /promotions/active) -> PortalPromotion.
 * Backend KHONG tra createdBy / createdAt (chi admin thay) -> de chuoi rong.
 */
export function mapPromotion(raw: Rec): PortalPromotion {
  const promotionId = num(pick(raw, 'promotionId', 'id'));
  const status = str(pick(raw, 'status')).toUpperCase() as PromotionStatus;
  const variants: PortalPromotionVariant[] = listOf({ items: raw.variants }).map((v) => ({
    promoVariantId: num(pick(v, 'promoVariantId')),
    promotionId,
    variantId: num(pick(v, 'variantId')),
    productId: num(pick(v, 'productId')),
    productName: str(pick(v, 'productName')),
    sku: str(pick(v, 'sku')),
    color: str(pick(v, 'color')),
    romGb: num(pick(v, 'romGb')),
    listPrice: num(pick(v, 'listPrice')),
    promoPrice: num(pick(v, 'promoPrice', 'promotionalPrice')),
  }));
  return {
    promotionId,
    name: str(pick(raw, 'name')),
    description: pick(raw, 'description') === undefined ? undefined : str(pick(raw, 'description')),
    startAt: str(pick(raw, 'startAt')),
    endAt: str(pick(raw, 'endAt')),
    status: PROMO_STATUSES.includes(status) ? status : 'ACTIVE',
    createdBy: '',
    createdAt: '',
    variants,
  };
}
