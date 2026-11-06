import { apiClient } from './apiClient';
import { 
  CartItem, 
  BackendCartData, 
  AddToCartResponse, 
  UpdateQuantityResponse, 
  RemoveCartItemResponse, 
  SyncCartResponse,
  mapBackendCartItemToCartItem
} from '../types/cart';

/**
 * Service Quản lý Giỏ hàng (Carts & Cart_Items - API 7.1 đến 7.6)
 * - API 7.1: GET    /api/v1/cart              -> Lấy toàn bộ giỏ hàng của user
 * - API 7.2: POST   /api/v1/cart/items        -> Thêm biến thể SKU vào giỏ hàng
 * - API 7.3: PUT    /api/v1/cart/items/:id    -> Thay đổi số lượng mua (+ / - / về 0 tự xóa)
 * - API 7.4: DELETE /api/v1/cart/items/:id    -> Xóa 1 SKU khỏi giỏ
 * - API 7.5: DELETE /api/v1/cart/clear        -> Xóa sạch toàn bộ giỏ hàng
 * - API 7.6: POST   /api/v1/cart/sync         -> Đồng bộ giỏ vãng lai (Guest) khi đăng nhập
 */

const STORAGE_GUEST_CART = 'nextpick_cart_guest';
const STORAGE_USER_CART_PREFIX = 'nextpick_cart_user_';

export const cartService = {
  // Lấy key storage cho khách vãng lai hoặc offline cache
  getStorageKey(userId?: number | null): string {
    return userId ? `${STORAGE_USER_CART_PREFIX}${userId}` : STORAGE_GUEST_CART;
  },

  // Đọc giỏ hàng cục bộ (Local fallback)
  getLocalCartItems(userId?: number | null): CartItem[] {
    const key = this.getStorageKey(userId);
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error(`Error loading cart from ${key}:`, err);
      return [];
    }
  },

  // Lưu giỏ hàng cục bộ
  saveLocalCartItems(items: CartItem[], userId?: number | null): void {
    const key = this.getStorageKey(userId);
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (err) {
      console.error(`Error saving cart to ${key}:`, err);
    }
  },

  // Xóa giỏ hàng cục bộ
  clearLocalCart(userId?: number | null): void {
    const key = this.getStorageKey(userId);
    localStorage.removeItem(key);
  },

  // API 7.1: GET /api/v1/cart - Lấy thông tin giỏ hàng của người dùng (Token Bearer)
  async getCart(): Promise<BackendCartData> {
    const res = await apiClient.get<{ success: boolean; data: BackendCartData }>('/cart');
    return res.data.data;
  },

  // API 7.2: POST /api/v1/cart/items - Thêm sản phẩm biến thể (SKU) vào giỏ hàng
  async addItem(variantId: number, quantity: number): Promise<AddToCartResponse> {
    const res = await apiClient.post<{ success: boolean; data: AddToCartResponse; message?: string }>('/cart/items', {
      variantId,
      quantity,
    });
    return res.data.data;
  },

  // API 7.3: PUT /api/v1/cart/items/{itemId} - Thay đổi số lượng mua (+ / - / 0 để xóa)
  async updateQuantity(cartItemId: number, quantity: number): Promise<UpdateQuantityResponse> {
    const res = await apiClient.put<{ success: boolean; data: UpdateQuantityResponse; message?: string }>(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return res.data.data;
  },

  // API 7.4: DELETE /api/v1/cart/items/{itemId} - Xóa 1 biến thể SKU khỏi giỏ hàng
  async removeItem(cartItemId: number): Promise<RemoveCartItemResponse> {
    const res = await apiClient.delete<{ success: boolean; data: RemoveCartItemResponse; message?: string }>(`/cart/items/${cartItemId}`);
    return res.data.data;
  },

  // API 7.5: DELETE /api/v1/cart/clear - Xóa sạch toàn bộ giỏ hàng
  async clearCart(): Promise<void> {
    await apiClient.delete('/cart/clear');
  },

  // API 7.6: POST /api/v1/cart/sync - Đồng bộ giỏ hàng vãng lai (Guest) vào tài khoản khi Đăng nhập
  async syncCart(guestItems: Array<{ variantId: number; quantity: number }>): Promise<SyncCartResponse> {
    const res = await apiClient.post<{ success: boolean; data: SyncCartResponse; message?: string }>('/cart/sync', {
      guestItems,
    });
    return res.data.data;
  },

  // Tương thích ngược với các hàm cũ
  getCartItems(userId?: number | null): CartItem[] {
    return this.getLocalCartItems(userId);
  },

  saveCartItems(items: CartItem[], userId?: number | null): void {
    this.saveLocalCartItems(items, userId);
  },

  async mergeGuestCartOnLogin(userId: number): Promise<CartItem[]> {
    const guestItems = this.getLocalCartItems(null);
    if (guestItems.length === 0) {
      try {
        const remoteCart = await this.getCart();
        return remoteCart.items.map(mapBackendCartItemToCartItem);
      } catch {
        return this.getLocalCartItems(userId);
      }
    }

    try {
      const payload = guestItems.map(g => ({ variantId: g.variantId, quantity: g.quantity }));
      await this.syncCart(payload);
      this.clearLocalCart(null);
      const remoteCart = await this.getCart();
      return remoteCart.items.map(mapBackendCartItemToCartItem);
    } catch {
      // Local fallback
      const userItems = this.getLocalCartItems(userId);
      const merged: CartItem[] = [...userItems];
      for (const gItem of guestItems) {
        const existingIdx = merged.findIndex(i => i.variantId === gItem.variantId);
        if (existingIdx > -1) {
          const cur = merged[existingIdx];
          merged[existingIdx] = {
            ...cur,
            quantity: Math.min(cur.quantity + gItem.quantity, cur.availableQty)
          };
        } else {
          merged.push(gItem);
        }
      }
      this.saveLocalCartItems(merged, userId);
      this.clearLocalCart(null);
      return merged;
    }
  }
};
