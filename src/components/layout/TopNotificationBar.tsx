import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, Zap, Sparkles, Gift, HelpCircle, PhoneCall } from 'lucide-react';

const TICKER_ITEMS = [
  { icon: Truck, text: 'Miễn phí giao hàng từ 500k', color: 'text-warning' },
  { icon: RotateCcw, text: 'Đổi trả 1-1 trong 30 ngày', color: 'text-success' },
  { icon: ShieldCheck, text: '100% Chính hãng VAT', color: 'text-primary-soft' },
  { icon: Zap, text: 'Giao nhanh hỏa tốc 2H', color: 'text-amber-400' },
  { icon: Sparkles, text: 'Thu cũ đổi mới trợ giá tới 3 triệu', color: 'text-rose-400' },
  { icon: Gift, text: 'Ưu đãi học sinh - sinh viên giảm thêm tới 500k', color: 'text-cyan-400' },
];

export const TopNotificationBar: React.FC = () => {
  // Nhân đôi mảng để tạo hiệu ứng vòng lặp vô tận (infinite marquee) mượt mà
  const loopItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-ink-deep text-canvas text-xs font-medium py-2 select-none border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        
        {/* Running Ticker Marquee Track */}
        <div className="flex-1 overflow-hidden relative cursor-default">
          {/* Fading gradient edges */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-ink-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-ink-deep to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-smooth flex items-center gap-8 py-0.5 whitespace-nowrap">
            {loopItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-canvas text-[11px] sm:text-xs tracking-tight shrink-0">
                  <Icon size={13} className={`${item.color} flex-shrink-0`} />
                  <span className="font-medium text-canvas/95">{item.text}</span>
                  <span className="text-white/20 select-none ml-2">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support & FAQ links right on top bar */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs shrink-0 pl-2 bg-ink-deep z-20">
          <a
            href="tel:18006936"
            className="hidden md:flex items-center gap-1 text-canvas/80 hover:text-canvas transition-colors"
          >
            <PhoneCall size={12} className="text-emerald-400" />
            <span>Hotline: <strong className="text-canvas">1800 6936</strong></span>
          </a>
          <span className="hidden md:inline text-canvas/30">|</span>
          <Link
            to="/faq"
            className="flex items-center gap-1 text-canvas/90 hover:text-white font-bold hover:underline transition-colors"
          >
            <HelpCircle size={13} className="text-amber-400" />
            <span>Hỏi đáp & Hỗ trợ (FAQ)</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
