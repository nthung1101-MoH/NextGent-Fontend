// Mapper cho API quản trị khuyến mãi & voucher (6.2-6.4, 6.7-6.9). Nguồn: AdminPromotionsController, AdminVouchersController.
import type { PortalPromotion, PortalVoucher, PromotionStatus } from '../../types/portal';
import { formatLocalDate, formatLocalDateTime, toBackendDateTime } from './adminCommon';
import { num, optNum, pick, str, type Rec } from './utils';

/** Dòng chiến dịch trong danh sách: backend chỉ trả số biến thể áp dụng, không trả chi tiết (variants luôn rỗng). */
export interface AdminPromotionRow extends PortalPromotion {
  appliedVariantsCount: number;
}

/** Dữ liệu tạo chiến dịch: cùng dạng sharedStore.addPromotion đang nhận. */
export type AdminPromotionInput = Omit<PortalPromotion, 'promotionId' | 'createdAt'>;
export type AdminVoucherInput = Omit<PortalVoucher, 'voucherId' | 'usedCount'>;

const PROMO_STATUSES: PromotionStatus[] = ['ACTIVE', 'UPCOMING', 'PAUSED', 'ENDED'];

export function promotionStatus(raw: unknown): PromotionStatus {
  const s = str(raw).toUpperCase() as PromotionStatus;
  return PROMO_STATUSES.includes(s) ? s : 'UPCOMING';
}

/** AdminPromotionItemResponse -> AdminPromotionRow. startAt/endAt dạng "YYYY-MM-DDTHH:mm" (giờ địa phương). */
export function mapAdminPromotion(r: Rec): AdminPromotionRow {
  return {
    promotionId: num(pick(r, 'promotionId', 'id')),
    name: str(pick(r, 'name')),
    description: str(pick(r, 'description')) || undefined,
    startAt: formatLocalDateTime(pick(r, 'startAt'), 'T'),
    endAt: formatLocalDateTime(pick(r, 'endAt'), 'T'),
    status: promotionStatus(pick(r, 'status')),
    createdBy: str(pick(r, 'createdBy')),
    createdAt: str(pick(r, 'createdAt')),
    variants: [],
    appliedVariantsCount: num(pick(r, 'appliedVariantsCount')),
  };
}

/** Body POST /admin/promotions (API 6.3). */
export const promotionBody = (d: AdminPromotionInput): Rec => ({
  name: d.name.trim(),
  description: d.description?.trim() || undefined,
  startAt: toBackendDateTime(d.startAt),
  endAt: toBackendDateTime(d.endAt),
  status: d.status,
  variants: d.variants.map((v) => ({ variantId: v.variantId, promoPrice: v.promoPrice })),
});

/** CreatePromotionResponse + dữ liệu đã gửi -> PortalPromotion (response không trả danh sách biến thể nên lấy từ input). */
export function mapCreatedPromotion(resp: Rec | undefined, input: AdminPromotionInput): PortalPromotion {
  return {
    ...input,
    promotionId: num(pick(resp, 'promotionId')),
    name: str(pick(resp, 'name'), input.name),
    status: resp ? promotionStatus(pick(resp, 'status')) : input.status,
    startAt: resp ? formatLocalDateTime(pick(resp, 'startAt'), 'T') || input.startAt : input.startAt,
    endAt: resp ? formatLocalDateTime(pick(resp, 'endAt'), 'T') || input.endAt : input.endAt,
    createdAt: str(pick(resp, 'createdAt'), new Date().toISOString()),
  };
}

const discountType = (raw: unknown): PortalVoucher['discountType'] =>
  str(raw).toUpperCase() === 'PERCENT' ? 'PERCENT' : 'FIXED';

/** AdminVoucherItemResponse -> PortalVoucher. startAt/expiredAt dạng "YYYY-MM-DD" (giao diện nhập bằng ô ngày). */
export function mapAdminVoucher(r: Rec): PortalVoucher {
  return {
    voucherId: num(pick(r, 'voucherId', 'id')),
    code: str(pick(r, 'code', 'voucherCode')),
    discountType: discountType(pick(r, 'discountType')),
    discountValue: num(pick(r, 'discountValue')),
    maxDiscount: optNum(pick(r, 'maxDiscount')),
    minOrderValue: num(pick(r, 'minOrderValue')),
    usageLimit: num(pick(r, 'usageLimit')),
    usedCount: num(pick(r, 'usedCount')),
    startAt: formatLocalDate(pick(r, 'startAt')),
    expiredAt: formatLocalDate(pick(r, 'expiredAt')),
    isActive: pick(r, 'isActive') !== false,
  };
}

/** Body POST /admin/vouchers (API 6.8). Mã voucher được backend chuẩn hóa in hoa. */
export const voucherBody = (d: AdminVoucherInput): Rec => ({
  code: d.code.trim().toUpperCase(),
  discountType: d.discountType,
  discountValue: d.discountValue,
  maxDiscount: d.maxDiscount,
  minOrderValue: d.minOrderValue,
  usageLimit: d.usageLimit,
  startAt: toBackendDateTime(d.startAt),
  expiredAt: toBackendDateTime(d.expiredAt, true),
  isActive: d.isActive,
});

/** CreateVoucherResponse + dữ liệu đã gửi -> PortalVoucher (response chỉ trả một phần trường). */
export function mapCreatedVoucher(resp: Rec | undefined, input: AdminVoucherInput): PortalVoucher {
  return {
    ...input,
    voucherId: num(pick(resp, 'voucherId')),
    code: str(pick(resp, 'code'), input.code.trim().toUpperCase()),
    discountType: resp ? discountType(pick(resp, 'discountType')) : input.discountType,
    discountValue: num(pick(resp, 'discountValue'), input.discountValue),
    usageLimit: num(pick(resp, 'usageLimit'), input.usageLimit),
    usedCount: num(pick(resp, 'usedCount'), 0),
    isActive: resp ? pick(resp, 'isActive') !== false : input.isActive,
  };
}
