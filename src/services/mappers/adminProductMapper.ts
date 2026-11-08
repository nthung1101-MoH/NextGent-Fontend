// Mapper cho API quản trị sản phẩm (4.5-4.9). THEO ĐẶC TẢ: backend chưa có controller cho nhóm này.
// Đặc tả chi tiết chỉ có cho 4.5; 4.6-4.9 chỉ có một dòng mô tả, các body bên dưới là SUY LUẬN (xem TIEN_DO_AI-3.md).
import type { Product, ProductSpecGroup, ProductVariant } from '../../types/product';
import { num, pick, type Rec } from './utils';

/** Một biến thể SKU khi tạo mới (4.5 trong mảng variants, 4.7 làm body riêng). */
export interface AdminVariantInput {
  sku: string;
  color: string;
  ramGb: number;
  romGb: number;
  connectionType?: string;
  listPrice: number;
  /** Tồn đầu kỳ, backend ghi vào Inventories.on_hand_qty. */
  initialOnHandQty: number;
  /** Ngưỡng an toàn; bỏ trống thì không gửi để backend dùng mặc định. */
  minThreshold?: number;
}

export interface AdminProductInput {
  name: string;
  categoryId: number;
  brandId: number;
  description?: string;
  warrantyPolicy: string;
  specGroups: ProductSpecGroup[];
  /** Danh sách URL ảnh, phần tử đầu là ảnh đại diện (isPrimary). */
  images: string[];
  variants: AdminVariantInput[];
}

/** 4.6: cập nhật thông tin chung, bảo hành, specs, ảnh (không gồm biến thể). */
export type AdminProductUpdateInput = Omit<AdminProductInput, 'variants'>;

/** 4.8: chỉ cập nhật giá niêm yết và trạng thái SKU. */
export interface AdminVariantUpdateInput {
  listPrice?: number;
  isActive?: boolean;
}

const variantBody = (v: AdminVariantInput): Rec => ({
  sku: v.sku.trim(),
  color: v.color.trim(),
  ramGb: v.ramGb,
  romGb: v.romGb,
  connectionType: v.connectionType?.trim() || undefined,
  listPrice: v.listPrice,
  initialOnHandQty: v.initialOnHandQty,
  minThreshold: v.minThreshold,
});

const specsBody = (groups: ProductSpecGroup[]): Rec[] => {
  const out: Rec[] = [];
  let order = 1;
  for (const g of groups) {
    for (const item of g.items) {
      out.push({ groupName: g.groupName, specName: item.name, specValue: item.value, sortOrder: item.sortOrder ?? order });
      order++;
    }
  }
  return out;
};

const imagesBody = (urls: string[]): Rec[] =>
  urls.filter((u) => u.trim() !== '').map((imageUrl, i) => ({ imageUrl, isPrimary: i === 0, sortOrder: i + 1 }));

/** Body POST /admin/products (4.5). */
export const productCreateBody = (p: AdminProductInput): Rec => ({
  name: p.name.trim(),
  categoryId: p.categoryId,
  brandId: p.brandId,
  description: p.description,
  warrantyPolicy: p.warrantyPolicy,
  specs: specsBody(p.specGroups),
  images: imagesBody(p.images),
  variants: p.variants.map(variantBody),
});

/** Body PUT /admin/products/{id} (4.6) - SUY LUẬN theo dạng của 4.5. */
export const productUpdateBody = (p: AdminProductUpdateInput): Rec => {
  const { variants: _ignored, ...rest } = productCreateBody({ ...p, variants: [] });
  void _ignored;
  return rest;
};

/** Body POST /admin/products/{id}/variants (4.7) - SUY LUẬN: cùng dạng một phần tử variants của 4.5. */
export const variantCreateBody = variantBody;

/** Body PUT /admin/products/variants/{varId} (4.8) - SUY LUẬN từ mô tả "giá niêm yết list_price và trạng thái SKU". */
export const variantUpdateBody = (v: AdminVariantUpdateInput): Rec => ({ listPrice: v.listPrice, isActive: v.isActive });

/** Chuyển Product của giao diện (kiểu dùng ở sharedStore.addProduct) sang dữ liệu gửi 4.5. */
export function productToAdminInput(p: Product, minThreshold?: number): AdminProductInput {
  const gallery = [p.thumbnail, ...p.gallery].filter((u, i, arr) => !!u && arr.indexOf(u) === i);
  return {
    name: p.name,
    categoryId: p.categoryId ?? 0,
    brandId: p.brandId ?? 0,
    warrantyPolicy: p.warrantyPolicy,
    specGroups: p.specGroups,
    images: gallery,
    variants: p.variants.map((v: ProductVariant) => ({
      sku: v.sku,
      color: v.color,
      ramGb: v.ramGb,
      romGb: v.romGb,
      connectionType: v.connectionType,
      listPrice: v.listPrice,
      initialOnHandQty: v.onHandQty,
      minThreshold,
    })),
  };
}

/** Lấy id từ phần data của phản hồi (4.5 trả { productId }; 4.7 dự kiến trả { variantId }). */
export const idFrom = (data: Rec | undefined, ...keys: string[]): number | undefined => {
  const v = pick(data, ...keys);
  const n = v === undefined ? NaN : num(v, NaN);
  return Number.isFinite(n) ? n : undefined;
};
