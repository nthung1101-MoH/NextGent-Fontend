export interface ProductReview {
  reviewId: number;
  orderItemId?: number; // Liên kết khóa ngoại với Order_Items (Bảng 22 Database)
  productId: number;
  productName?: string;
  userName: string;
  userPhoneMasked: string; // ví dụ 098****321
  rating: number; // 1 to 5
  comment: string;
  storeReply?: string;
  repliedAt?: string;
  images?: string[];
  createdAt: string;
  isBuyerVerified: boolean; // Chỉ người đã mua và Hoàn tất mới có nhãn này
}
