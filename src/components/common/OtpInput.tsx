import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: (otp: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
  onComplete,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Tách giá trị thành mảng ký tự
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Lấy ký tự số cuối cùng được nhập
    const digit = rawVal.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.length === length && onComplete) {
      onComplete(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    const targetIdx = Math.min(pastedData.length, length - 1);
    inputsRef.current[targetIdx]?.focus();

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 my-4">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all duration-150 outline-none select-none ${
            digits[index]
              ? 'border-primary bg-primary/5 text-primary shadow-xs ring-2 ring-primary/20'
              : 'border-hairline-soft bg-surface-soft hover:bg-hairline-soft/40 focus:border-primary focus:bg-canvas focus:ring-2 focus:ring-primary/20 text-ink-deep'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-hairline-soft/20' : ''}`}
        />
      ))}
    </div>
  );
};
