import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showLeftLockIcon?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  disabled = false,
  className = '',
  showLeftLockIcon = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full h-11 bg-canvas border border-hairline rounded-lg text-xs text-ink focus:border-2 focus:border-fb-blue focus:outline-none transition-all disabled:opacity-60 ${
          showLeftLockIcon ? 'pl-9' : 'pl-3.5'
        } pr-10 ${className}`}
        {...props}
      />

      {/* Icon khóa bên trái nếu được yêu cầu */}
      {showLeftLockIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-steel pointer-events-none">
          <Lock size={15} />
        </div>
      )}

      {/* Nút con mắt Toggle Ẩn / Hiện mật khẩu */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-steel hover:text-ink-deep rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {showPassword ? (
          <EyeOff size={16} className="text-primary" />
        ) : (
          <Eye size={16} />
        )}
      </button>
    </div>
  );
};
