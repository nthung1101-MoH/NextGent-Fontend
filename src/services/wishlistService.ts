import { apiClient } from './apiClient';
import { hasSession, isBackendDown, mockFallbackEnabled, serverMessage, unwrapData, warnFallback } from './apiHelpers';
import { asRec, listOf, num, optNum, pick, totalPagesOf, type Rec } from './mappers/utils';
import { errorCodeOf, type ServiceResult } from './apiHelpers';

/**
 * THEO DAC TA (backend chua co WishlistsController; dac ta 13.1 / 13.2 chi co mot dong mo ta, khong co schema):
 * - 13.1 GET  /wishlists          -> danh sach san pham yeu thich cua tai khoan
 * - 13.2 POST /wishlists/toggle   -> them / bo san pham. Body gia dinh: { productId }
 * Phan hoi duoc doc linh hoat (productId nam o goc hoac trong `product`), xem TIEN_DO.
 */

const PAGE_SIZE = 100;
const MAX_PAGES = 5;

const productIdOf = (row: Rec): number | undefined =>
  optNum(pick(row, 'productId')) ?? optNum(pick(asRec(pick(row, 'product')), 'productId', 'id'));

const localKey = (userId?: number | null): string => (userId ? `nextpick_wishlist_user_${userId}` : 'nextpick_wishlist_guest');

function readLocalIds(userId?: number | null): number[] {
  try {
    const raw = localStorage.getItem(localKey(userId));
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map((x) => num(x)).filter((n) => n > 0) : [];
  } catch {
    return [];
  }
}

async function fetchIds(): Promise<number[]> {
  const ids: number[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await apiClient.get('/wishlists', { params: { page, size: PAGE_SIZE } });
    const body = unwrapData(res.data);
    for (const row of listOf(body)) {
      const id = productIdOf(row);
      if (id !== undefined) ids.push(id);
    }
    if (page >= totalPagesOf(body)) break;
  }
  return ids;
}

export const wishlistService = {
  // 13.1 GET /wishlists -> mang productId (dung kieu cua wishlistStore)
  async getWishlistProductIds(userId?: number | null): Promise<number[]> {
    if (!hasSession() && mockFallbackEnabled()) return readLocalIds(userId);
    try {
      return await fetchIds();
    } catch (e) {
      if (!mockFallbackEnabled()) throw e;
      warnFallback('getWishlistProductIds', e);
      return readLocalIds(userId);
    }
  },

  /**
   * 13.2 POST /wishlists/toggle. data = true neu san pham dang nam trong danh sach sau khi toggle, false neu vua bi bo.
   * Neu phan hoi khong cho biet trang thai, doc lai GET /wishlists de xac dinh.
   */
  async toggle(productId: number): Promise<ServiceResult<boolean>> {
    try {
      const res = await apiClient.post('/wishlists/toggle', { productId });
      const body = asRec(unwrapData(res.data));
      const flag = pick(body, 'isWishlisted', 'wishlisted', 'inWishlist', 'isFavorite', 'favorite', 'added', 'isAdded');
      const message = (res.data as { message?: string } | undefined)?.message ?? 'Đã cập nhật danh sách yêu thích';
      const inList = flag !== undefined ? Boolean(flag) : (await fetchIds()).includes(productId);
      return { success: true, message, data: inList };
    } catch (e) {
      if (isBackendDown(e) && mockFallbackEnabled()) {
        warnFallback('wishlist.toggle', e);
        // wishlistStore da cap nhat localStorage; bao ve phia may, chua dong bo may chu
        return { success: true, message: 'Đã lưu tạm trên thiết bị (chưa đồng bộ máy chủ).', code: 'OFFLINE' };
      }
      return { success: false, message: isBackendDown(e) ? 'Không kết nối được máy chủ. Vui lòng thử lại sau.' : serverMessage(e, 'Không thể cập nhật danh sách yêu thích.'), code: errorCodeOf(e) };
    }
  },
};
