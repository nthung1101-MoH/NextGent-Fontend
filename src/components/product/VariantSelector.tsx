import React from 'react';
import { ProductVariant } from '../../types/product';
import { formatVND } from '../common/PriceDisplay';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  // Gom danh sách ROM duy nhất
  const uniqueRoms = Array.from(new Set(variants.map(v => v.romGb))).sort((a, b) => a - b);
  // Gom danh sách Màu sắc có sẵn cho ROM hiện tại
  const colorsForCurrentRom = variants.filter(v => v.romGb === selectedVariant.romGb);

  const handleRomChange = (rom: number) => {
    // Tìm biến thể cùng màu sắc nếu có, không thì lấy biến thể đầu tiên của ROM đó
    const matchSameColor = variants.find(v => v.romGb === rom && v.color === selectedVariant.color);
    if (matchSameColor) {
      onSelectVariant(matchSameColor);
    } else {
      const firstWithRom = variants.find(v => v.romGb === rom);
      if (firstWithRom) onSelectVariant(firstWithRom);
    }
  };

  const handleColorChange = (color: string) => {
    const match = variants.find(v => v.romGb === selectedVariant.romGb && v.color === color);
    if (match) onSelectVariant(match);
  };

  return (
    <div className="space-y-5">
      
      {/* 1. Lựa chọn Dung lượng ROM */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-700 uppercase">1. Chọn phiên bản bộ nhớ:</span>
          <span className="text-slate-400 font-mono text-[11px]">SKU: {selectedVariant.sku}</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {uniqueRoms.map((rom) => {
            const vSample = variants.find(v => v.romGb === rom);
            const isSelected = selectedVariant.romGb === rom;
            const isOutOfStock = vSample ? vSample.availableQty <= 0 : false;

            return (
              <button
                key={rom}
                disabled={isOutOfStock}
                onClick={() => handleRomChange(rom)}
                className={`p-3 rounded-lg text-left transition-all relative ${
                  isOutOfStock
                    ? 'border border-hairline bg-surface-soft opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'border-2 border-primary bg-canvas text-ink-deep'
                    : 'border border-hairline bg-canvas hover:border-slate text-ink'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
                <div className="font-bold text-xs">{rom >= 1024 ? '1 TB' : `${rom} GB`}</div>
                <div className="text-xs font-semibold text-steel mt-0.5">
                  {vSample ? formatVND(vSample.salePrice) : ''}
                </div>
                {isOutOfStock && (
                  <div className="text-[10px] text-critical font-semibold mt-0.5">Hết hàng</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Lựa chọn Màu sắc */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-ink uppercase">2. Chọn màu sắc:</span>
          <span className="text-ink-deep font-semibold">{selectedVariant.color}</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {colorsForCurrentRom.map((v) => {
            const isSelected = selectedVariant.variantId === v.variantId;
            const isOutOfStock = v.availableQty <= 0;

            return (
              <button
                key={v.variantId}
                disabled={isOutOfStock}
                onClick={() => handleColorChange(v.color)}
                className={`p-3 rounded-lg text-left flex items-center gap-2.5 transition-all ${
                  isOutOfStock
                    ? 'border border-hairline bg-surface-soft opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'border-2 border-primary bg-canvas text-ink-deep'
                    : 'border border-hairline bg-canvas hover:border-slate text-ink'
                }`}
              >
                {v.colorHex && (
                  <span 
                    className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                      isSelected ? 'ring-2 ring-primary ring-offset-1 border-transparent' : 'border-hairline'
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                  />
                )}
                <div className="truncate">
                  <div className="font-bold text-xs truncate">{v.color}</div>
                  <div className="text-[11px] text-steel">{formatVND(v.salePrice)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
