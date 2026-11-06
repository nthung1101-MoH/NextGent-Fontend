import { apiClient } from './apiClient';

export interface BrandItem {
  brandId: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  isVisible: boolean;
  totalProducts: number;
}

export interface BrandPayload {
  name: string;
  slug?: string;
  logoUrl?: string;
  description?: string;
  isVisible?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  error?: string;
  timestamp?: string;
}

export const brandService = {
  // API 3.6: Danh sách thương hiệu đối tác (Public/Admin)
  async getBrands(includeHidden = true): Promise<ApiResponse<BrandItem[]>> {
    const res = await apiClient.get<ApiResponse<BrandItem[]>>('/brands', {
      params: { includeHidden },
    });
    return res.data;
  },

  // API 3.7: Chi tiết thương hiệu (Public/Admin)
  async getBrandById(id: number): Promise<ApiResponse<BrandItem>> {
    const res = await apiClient.get<ApiResponse<BrandItem>>(`/brands/${id}`);
    return res.data;
  },

  // API 3.8: Thêm mới thương hiệu (STAFF / ADMIN)
  async createBrand(payload: BrandPayload): Promise<ApiResponse<BrandItem>> {
    const res = await apiClient.post<ApiResponse<BrandItem>>('/admin/brands', payload);
    return res.data;
  },

  // API 3.9: Cập nhật thương hiệu (STAFF / ADMIN)
  async updateBrand(id: number, payload: BrandPayload): Promise<ApiResponse<BrandItem>> {
    const res = await apiClient.put<ApiResponse<BrandItem>>(`/admin/brands/${id}`, payload);
    return res.data;
  },

  // API 3.10: Xóa thương hiệu (duy nhất ADMIN)
  async deleteBrand(id: number): Promise<ApiResponse<null>> {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/brands/${id}`);
    return res.data;
  },
};
