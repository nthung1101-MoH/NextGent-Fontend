import React, { useRef } from 'react';
import { Camera, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export interface ReviewImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export const ReviewImageUploader: React.FC<ReviewImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 3,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setErrorMsg(`Bạn chỉ có thể tải lên tối đa ${maxImages} hình ảnh.`);
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const newImages: string[] = [];
    let processedCount = 0;

    selectedFiles.forEach((file) => {
      // Kiểm tra dung lượng file (tối đa 3MB)
      if (file.size > 3 * 1024 * 1024) {
        setErrorMsg(`Hình "${file.name}" vượt quá dung lượng cho phép (tối đa 3MB/ảnh).`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrorMsg(`Tệp "${file.name}" không phải là định dạng hình ảnh hợp lệ.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        processedCount++;
        if (processedCount === selectedFiles.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.onerror = () => {
        processedCount++;
        if (processedCount === selectedFiles.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setErrorMsg(null);
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-charcoal flex items-center gap-1.5">
          <Camera size={14} className="text-primary" />
          <span>Hình ảnh thực tế đính kèm:</span>
        </label>
        <span className="text-[11px] text-steel">
          ({images.length}/{maxImages} ảnh)
        </span>
      </div>

      {errorMsg && (
        <div className="p-2.5 bg-critical/10 border border-critical/30 rounded-lg text-critical text-[11px] flex items-center gap-1.5">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={disabled || images.length >= maxImages}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Previews and Add Button */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className="relative w-20 h-20 rounded-xl border border-hairline-soft overflow-hidden group shadow-xs bg-surface-soft"
          >
            <img
              src={imgUrl}
              alt={`Ảnh đánh giá ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-ink-deep/80 hover:bg-critical text-canvas rounded-full flex items-center justify-center transition opacity-90 group-hover:opacity-100 shadow-sm"
                title="Xóa ảnh này"
              >
                <X size={12} />
              </button>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-ink-deep/60 text-canvas text-[9px] text-center py-0.5 font-mono">
              Ảnh {idx + 1}
            </div>
          </div>
        ))}

        {/* Upload Trigger Button */}
        {images.length < maxImages && !disabled && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-hairline hover:border-primary bg-surface-soft/60 hover:bg-surface-soft flex flex-col items-center justify-center gap-1 text-steel hover:text-primary transition-all group"
          >
            <div className="p-1 rounded-full bg-canvas border border-hairline-soft group-hover:scale-110 transition-transform">
              <Camera size={16} />
            </div>
            <span className="text-[10px] font-bold">Thêm ảnh</span>
          </button>
        )}
      </div>

      <p className="text-[10px] text-steel">
        * Tối đa {maxImages} ảnh chụp thật ngoại quan hoặc hóa đơn mở hộp máy (Định dạng JPG, PNG, tối đa 3MB/ảnh).
      </p>
    </div>
  );
};
