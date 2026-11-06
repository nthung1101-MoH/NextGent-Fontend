import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.getTotalCount());

  const navItems = [
    { to: '/', label: 'Trang chủ', icon: Home, exact: true },
    { to: '/products', label: 'Sản phẩm', icon: Grid, exact: false },
    { to: '/cart', label: 'Giỏ hàng', icon: ShoppingBag, badge: cartCount, exact: true },
    { to: '/orders', label: 'Đơn hàng', icon: Package, exact: false },
    { to: '/account', label: 'Tài khoản', icon: User, exact: false },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.to;
    if (item.to === '/orders') {
      return location.pathname.startsWith('/orders') || location.pathname.startsWith('/order-tracking');
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-canvas border-t border-hairline-soft z-40 py-2 px-3 flex items-center justify-around shadow-sticky">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center min-w-[50px] py-1 transition-colors relative ${
              active ? 'text-primary font-bold' : 'text-steel hover:text-ink'
            }`}
          >
            <div className="relative">
              <Icon size={20} className={active ? 'text-primary' : 'text-steel'} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-canvas">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
