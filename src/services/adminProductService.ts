// Service quản trị sản phẩm (API 4.5, 4.6, 4.7, 4.8, 4.9). Nguồn: THEO ĐẶC TẢ (backend chưa có controller).
// Chỉ 4.5 có đặc tả chi tiết; body của 4.6-4.9 là suy luận, xem mục "CẦN XÁC NHẬN" trong TIEN_DO_AI-3.md.
// productService.ts (3.2, 3.7, 4.4) thuộc AI-4 nên không đụng tới.
import { apiClient } from './apiClient';
import type { Product } from '../types/product';
import { sharedStore } from './sharedStore';
import { isBackendDown, mockFallbackEnabled, serverMessage, unwrapData, warnFallback } from './apiHelpers';
import { bodyMessage, type ServiceResult } from './mappers/adminCommon';
import {
  idFrom,
  productCreateBody,
  productToAdminInput,
  productUpdateBody,
  variantCreateBody,
  variantUpdateBody,
  type AdminProductInput,
  type AdminProductUpdateInput,
  type AdminVariantInput,
  type AdminVariantUpdateInput,
} from './mappers/adminProductMapper';
import { asRec } from './mappers/utils';

export type { AdminProductInput, AdminProductUpdateInput, AdminVariantInput, AdminVariantUpdateInput };
export { productToAdminInput };

const useMock = (e: unknown, scope: string): boolean => {
  if (isBackendDown(e) && mockFallbackEnabled()) {
    warnFallback(scope, e);
    return true;
  }
  return false;
};

export const adminProductService = {
  // 4.5 POST /admin/products: tạo sản phẩm kèm specs, ảnh, SKU và khởi tạo tồn kho (một giao dịch). Phản hồi: { productId }.
  async createProduct(input: AdminProductInput): Promise<ServiceResult<{ productId: number }>> {
    try {
      const res = await apiClient.post('/admin/products', productCreateBody(input));
      const productId = idFrom(asRec(unwrapData(res.data)), 'productId', 'id');
      return {
        success: true,
        message: bodyMessage(res.data, 'Khai báo sản phẩm và danh sách biến thể SKU thành công!'),
        data: productId !== undefined ? { productId } : undefined,
      };
    } catch (e) {
      if (useMock(e, 'createProduct')) {
        const productId = Date.now();
        const brandName = sharedStore.getPortalBrands().find((b) => b.brandId === input.brandId)?.name ?? '';
        const categoryName = sharedStore.getCategories().find((c) => c.categoryId === input.categoryId)?.name ?? '';
        const primary = input.images[0] ?? '';
        const product: Product = {
          productId,
          name: input.name,
          brandName,
          categoryName,
          categoryId: input.categoryId,
          brandId: input.brandId,
          isInstallment0: false,
          warrantyPolicy: input.warrantyPolicy,
          thumbnail: primary,
          gallery: input.images,
          rating: 0,
          reviewCount: 0,
          specGroups: input.specGroups,
          highlights: [],
          variants: input.variants.map((v, i) => ({
            variantId: productId + i + 1,
            productId,
            sku: v.sku,
            color: v.color,
            ramGb: v.ramGb,
            romGb: v.romGb,
            connectionType: v.connectionType,
            listPrice: v.listPrice,
            salePrice: v.listPrice,
            onHandQty: v.initialOnHandQty,
            reservedQty: 0,
            availableQty: v.initialOnHandQty,
            imageUrl: primary,
            isActive: true,
          })),
        };
        const ok = sharedStore.addProduct(product);
        return {
          success: ok,
          message: ok ? 'Khai báo sản phẩm và danh sách biến thể SKU thành công!' : 'Không thể thêm sản phẩm.',
          data: ok ? { productId } : undefined,
        };
      }
      return { success: false, message: serverMessage(e, 'Không thể tạo sản phẩm. Vui lòng thử lại sau.') };
    }
  },

  // 4.6 PUT /admin/products/{id}: cập nhật thông tin chung, bảo hành, thông số kỹ thuật, ảnh. (body SUY LUẬN theo 4.5)
  async updateProduct(productId: number, input: AdminProductUpdateInput): Promise<ServiceResult<{ productId: number }>> {
    try {
      const res = await apiClient.put(`/admin/products/${productId}`, productUpdateBody(input));
      return {
        success: true,
        message: bodyMessage(res.data, 'Cập nhật sản phẩm thành công!'),
        data: { productId },
      };
    } catch (e) {
      if (useMock(e, 'updateProduct')) {
        const primary = input.images[0];
        const ok = sharedStore.updateProduct(productId, {
          name: input.name,
          categoryId: input.categoryId,
          brandId: input.brandId,
          warrantyPolicy: input.warrantyPolicy,
          specGroups: input.specGroups,
          ...(primary ? { thumbnail: primary, gallery: input.images } : {}),
        });
        return { success: ok, message: ok ? 'Cập nhật sản phẩm thành công!' : 'Sản phẩm không tồn tại', data: ok ? { productId } : undefined };
      }
      return { success: false, message: serverMessage(e, 'Không thể cập nhật sản phẩm. Vui lòng thử lại sau.') };
    }
  },

  // 4.7 POST /admin/products/{id}/variants: thêm biến thể SKU kèm khởi tạo tồn kho. (body SUY LUẬN, dùng dạng phần tử variants của 4.5)
  // sharedStore chưa có hàm thêm biến thể nên không có dữ liệu mẫu để dự phòng.
  async createVariant(productId: number, input: AdminVariantInput): Promise<ServiceResult<{ variantId?: number }>> {
    try {
      const res = await apiClient.post(`/admin/products/${productId}/variants`, variantCreateBody(input));
      return {
        success: true,
        message: bodyMessage(res.data, 'Thêm biến thể SKU thành công!'),
        data: { variantId: idFrom(asRec(unwrapData(res.data)), 'variantId', 'id') },
      };
    } catch (e) {
      return { success: false, message: serverMessage(e, 'Không thể thêm biến thể. Vui lòng thử lại sau.') };
    }
  },

  // 4.8 PUT /admin/products/variants/{varId}: cập nhật giá niêm yết và trạng thái SKU. (body SUY LUẬN: { listPrice, isActive })
  async updateVariant(variantId: number, input: AdminVariantUpdateInput): Promise<ServiceResult> {
    try {
      const res = await apiClient.put(`/admin/products/variants/${variantId}`, variantUpdateBody(input));
      return { success: true, message: bodyMessage(res.data, 'Cập nhật biến thể SKU thành công!') };
    } catch (e) {
      if (useMock(e, 'updateVariant')) {
        const owner = sharedStore.getProducts().find((p) => p.variants.some((v) => v.variantId === variantId));
        if (!owner) return { success: false, message: 'Biến thể sản phẩm không tồn tại.' };
        const ok = sharedStore.updateVariant(owner.productId, variantId, {
          ...(input.listPrice !== undefined ? { listPrice: input.listPrice } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        });
        return { success: ok, message: ok ? 'Cập nhật biến thể SKU thành công!' : 'Không thể cập nhật biến thể.' };
      }
      return { success: false, message: serverMessage(e, 'Không thể cập nhật biến thể. Vui lòng thử lại sau.') };
    }
  },

  // 4.9 PATCH /admin/products/{id}/status: bật/tắt trạng thái kinh doanh. (body SUY LUẬN: { isActive })
  // sharedStore.Product không có cờ trạng thái kinh doanh nên không có dữ liệu mẫu để dự phòng.
  async setProductStatus(productId: number, isActive: boolean): Promise<ServiceResult<{ productId: number; isActive: boolean }>> {
    try {
      const res = await apiClient.patch(`/admin/products/${productId}/status`, { isActive });
      const row = asRec(unwrapData(res.data));
      const confirmed = row && typeof row.isActive === 'boolean' ? row.isActive : isActive;
      return {
        success: true,
        message: bodyMessage(res.data, 'Cập nhật trạng thái kinh doanh thành công!'),
        data: { productId, isActive: confirmed },
      };
    } catch (e) {
      return { success: false, message: serverMessage(e, 'Không thể đổi trạng thái sản phẩm. Vui lòng thử lại sau.') };
    }
  },
};
