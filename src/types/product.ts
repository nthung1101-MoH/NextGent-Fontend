export interface ProductVariant {
  variantId: number;
  productId: number;
  sku: string;                    // Mã SKU biến thể độc lập
  color: string;                  // Tên màu (Titan Tự Nhiên, Đen, Xanh...)
  colorHex?: string;              // Mã màu hiển thị dot swatch
  ramGb: number;                  // RAM (8, 12, 16...)
  romGb: number;                  // ROM (128, 256, 512, 1024...)
  connectionType?: string;        // 5G, LTE, Wifi
  listPrice: number;              // Giá niêm yết
  salePrice: number;              // Giá bán hiện hành (hoặc sau Flash sale)
  onHandQty: number;              // Tồn thực tế vật lý
  reservedQty: number;            // Tồn đang giữ chỗ
  availableQty: number;           // Tồn khả dụng = onHandQty - reservedQty
  imageUrl: string;               // Ảnh của đúng màu sắc biến thể
  isActive?: boolean;             // Trạng thái kinh doanh biến thể
}

export interface ProductSpecItem {
  name: string;
  value: string;
  sortOrder?: number;
}

export interface ProductSpecGroup {
  groupName: string;              // Ví dụ: "Màn hình", "Camera sau", "Cấu hình & Bộ nhớ", "Pin & Sạc"
  items: ProductSpecItem[];
}

export interface Product {
  productId: number;
  name: string;
  brandName: string;
  categoryName: string;
  categoryId?: number;
  brandId?: number;
  isInstallment0: boolean;        // Hỗ trợ Trả góp 0%
  warrantyPolicy: string;         // Chính sách bảo hành
  thumbnail: string;
  gallery: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  specGroups: ProductSpecGroup[];
  highlights: string[];           // Các đặc điểm nổi bật tóm tắt
  giftDescription?: string;       // Quà tặng đi kèm nếu có
  isFlashSale?: boolean;
  soldCount?: number;             // Số lượng đã bán
}

export interface Brand {
  brandId: number;
  name: string;
  logoUrl?: string;
  slug: string;
  description?: string;
  isVisible?: boolean;
}
