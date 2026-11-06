import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Laptop, Tablet, Headphones, Flame, HelpCircle } from 'lucide-react';

export const NavigationMenu: React.FC = () => {
  const location = useLocation();

  const isCurrent = (targetPath: string) => {
    if (targetPath.includes('?')) {
      const [path, query] = targetPath.split('?');
      return location.pathname === path && location.search.includes(query);
    }
    return location.pathname === targetPath && (!location.search || location.search === '');
  };

  // Các danh mục cốt lõi: Điện thoại, Laptop, Tablet, Phụ kiện, Khuyến mãi
  const navLinks = [
    { to: '/products?category=phone', label: 'Điện thoại', icon: Smartphone },
    { to: '/products?category=laptop', label: 'Laptop', icon: Laptop },
    { to: '/products?category=tablet', label: 'Máy tính bảng', icon: Tablet },
    { to: '/products?category=accessory', label: 'Phụ kiện di động', icon: Headphones },
    { to: '/products?sale=true', label: 'Khuyến mãi Flash Sale', icon: Flame, isFlash: true },
    { to: '/faq', label: 'Hỏi đáp & CSKH', icon: HelpCircle },
  ];

  return (
    <nav className="bg-canvas border-b border-hairline-soft hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        
        {/* Category Navigation Pills (DESIGN-meta button-pill-tab) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  active? 'bg-ink-deep text-canvas border-transparent shadow-subtle': item.isFlash? 'bg-canvas text-critical border border-hairline hover:border-slate': 'bg-canvas text-ink border border-hairline hover:border-slate'
                }`}
              >
                <Icon
                  size={15}
                  className={
                    active? 'text-canvas': item.isFlash? 'text-critical': 'text-steel'
                  }
                />
                <span>{item.label}</span>
                {item.isFlash && (
                  <span className="w-2 h-2 rounded-full bg-critical animate-ping" />
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
};
