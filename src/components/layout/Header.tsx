import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Scale, ChevronDown, Sparkles, LogOut, X } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCompareStore } from '../../stores/compareStore';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../stores/toastStore';
import { NotificationBell } from '../common/NotificationBell';
import { CategoryMegaMenu } from './CategoryMegaMenu';

export const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const totalCartCount = useCartStore((state) => state.getTotalCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const compareCount = useCompareStore((state) => state.productIds.length);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { showToast } = useToastStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-canvas border-b border-hairline-soft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo Premium */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <img
            src="/logo.png"
            alt="NextGen Smart Tech"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs border border-hairline-soft group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-ink-deep leading-none">
              Next<span className="text-primary">Gen</span>
            </span>
            <span className="text-[10px] text-steel font-bold tracking-wider hidden sm:block mt-0.5 uppercase">
              Smart Tech
            </span>
          </div>
        </Link>

        {/* Mega Menu Danh mục sản phẩm (CellphoneS style) */}
        <CategoryMegaMenu />

        {/* Search Bar - Modern Rounded Capsule (DESIGN-meta search-pill) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm thiết bị di động, tablet, phụ kiện..."
            className="w-full h-10 pl-11 pr-24 bg-surface-soft hover:bg-hairline-soft/30 focus:bg-canvas text-sm text-ink placeholder:text-steel rounded-full border border-hairline-soft focus:border-fb-blue focus:outline-none transition-all"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-ink-button hover:bg-charcoal text-on-ink-button text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* So sánh */}
          <Link
            to="/compare"
            className="btn-icon-circular relative"
            title="So sánh cấu hình sản phẩm"
          >
            <Scale size={18} />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Yêu thích */}
          <Link
            to="/wishlist"
            className="btn-icon-circular relative"
            title="Danh sách sản phẩm yêu thích"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-critical text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Thông báo (Bảng Notifications) */}
          <NotificationBell />

          {/* User Account Popover */}
          <div className="relative group">
            <Link
              to={isAuthenticated? "/account": "/auth"}
              className="flex items-center gap-2 text-xs font-bold text-ink hover:text-ink-deep px-3 py-1.5 rounded-full border border-hairline-soft hover:bg-surface-soft transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-surface-soft flex items-center justify-center text-ink font-bold text-xs">
                {isAuthenticated && user? user.fullName.charAt(0): <User size={14} className="text-steel" />}
              </div>
              <span className="hidden sm:inline">
                {isAuthenticated && user? user.fullName.split(' ').slice(-1)[0]: 'Tài khoản'}
              </span>
              <ChevronDown size={12} className="text-steel hidden sm:block" />
            </Link>

            {/* Account Quick Popover Menu */}
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50 min-w-[220px] animate-in fade-in duration-150">
              <div className="bg-canvas border border-hairline-soft rounded-xl shadow-summary p-2 text-xs space-y-1">
                {isAuthenticated && user? (
                  <>
                    <div className="px-3 py-2 border-b border-hairline-soft mb-1">
                      <div className="font-bold text-ink-deep line-clamp-1">{user.fullName}</div>
                      <div className="text-[11px] text-steel font-mono mt-0.5">{user.phone}</div>
                      <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-soft text-ink border border-hairline-soft">
                        {user.role}
                      </div>
                    </div>
                    <Link
                      to="/account?tab=profile"
                      className="block px-3 py-2 rounded-lg text-ink hover:bg-surface-soft hover:text-ink-deep font-semibold transition"
                    >
                      Thông tin & Sổ địa chỉ
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 rounded-lg text-ink hover:bg-surface-soft hover:text-ink-deep font-semibold transition"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <Link
                      to="/notifications"
                      className="block px-3 py-2 rounded-lg text-ink hover:bg-surface-soft hover:text-ink-deep font-semibold transition"
                    >
                      Thông báo của bạn
                    </Link>
                    {(user.role === 'STAFF' || user.role === 'ADMIN') && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 rounded-lg text-primary hover:bg-surface-soft font-bold transition border-t border-hairline-soft pt-2"
                      >
                        Vào Cổng Quản trị &rarr;
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-3 py-2 rounded-lg text-critical hover:bg-critical/10 font-bold transition flex items-center gap-2 border-t border-hairline-soft pt-2 mt-1 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ): (
                  <div className="p-3 space-y-2">
                    <div className="text-steel text-xs leading-snug">
                      Đăng nhập để theo dõi đơn hàng và lưu ưu đãi mua sắm.
                    </div>
                    <Link
                      to="/auth?mode=login"
                      className="block w-full py-2.5 text-center bg-ink-button hover:bg-charcoal text-on-ink-button font-bold rounded-full text-xs transition"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/auth?mode=register"
                      className="block w-full py-2.5 text-center bg-surface-soft hover:bg-hairline-soft text-ink font-bold rounded-full text-xs transition"
                    >
                      Đăng ký thành viên
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Pill Button (DESIGN-meta commerce buy affordance) */}
          <Link
            to="/cart"
            className="flex items-center gap-2 bg-primary hover:bg-primary-deep active:bg-primary-deep text-on-primary px-4 py-2 rounded-full transition-colors"
          >
            <div className="relative">
              <ShoppingBag size={17} />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-warning text-ink-deep text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden md:inline">Giỏ hàng</span>
          </Link>

        </div>

      </div>

      {/* Modal xác nhận đăng xuất từ Header */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-ink-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-canvas border border-hairline-soft rounded-2xl p-6 shadow-2xl space-y-4 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-soft">
              <h4 className="font-bold text-ink-deep text-sm flex items-center gap-2">
                <LogOut size={16} className="text-critical" />
                <span>Xác nhận đăng xuất</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="p-1 text-steel hover:text-ink rounded-lg hover:bg-surface-soft transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-charcoal text-xs leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </p>

            <div className="flex gap-2.5 justify-end pt-2 border-t border-hairline-soft">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="btn-ghost px-4 py-2 text-xs font-bold rounded-full"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  showToast('Đã đăng xuất tài khoản thành công', 'info');
                  navigate('/');
                }}
                className="bg-critical hover:bg-critical-strong text-canvas px-5 py-2 text-xs font-bold rounded-full shadow-xs transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
