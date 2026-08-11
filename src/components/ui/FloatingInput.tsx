'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

export interface FloatingInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  /** External error state (e.g. failed pincode lookup) — shows red without a message. */
  hasError?: boolean;
  /** Optional trailing slot inside the input row (e.g. spinner or check icon). */
  rightSlot?: React.ReactNode;
}

/**
 * Floating-label, underline-only input matching the swiss-design pattern
 * used in the contact form and cart coupon. Transparent background, animated
 * focus underline, label that scales to a small uppercase caption when the
 * field has value or focus.
 */
const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      hasError,
      rightSlot,
      required,
      type = 'text',
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const isActive = focused || (typeof value === 'string' && value.length > 0);
    const isError = !!error || !!hasError;

    return (
      <div className="group relative">
        <div className="relative flex items-end">
          <div className="flex-1 relative">
            <label
              className={`absolute left-0 transition-all duration-300 pointer-events-none font-sans ${
                isActive
                  ? 'text-[10px] tracking-widest uppercase top-0 text-ivory/35'
                  : 'text-base top-6 text-ivory/35'
              }`}
            >
              {label}
              {required && !isActive && (
                <span className="text-gray-300 ml-0.5">*</span>
              )}
            </label>
            <input
              ref={ref}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              required={required}
              className={`w-full bg-transparent pt-4 pb-3 pr-6 text-base text-ivory outline-none border-b transition-colors duration-300 ${
                isError
                  ? 'border-red-300'
                  : focused
                    ? 'border-gray-900'
                    : 'border-ivory/10'
              }`}
              {...rest}
            />
            <div
              className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out ${
                isError ? 'bg-red-500' : 'bg-gray-900'
              } ${focused ? 'w-full' : 'w-0'}`}
            />
            {rightSlot && (
              <div className="absolute right-0 bottom-3 flex items-center pointer-events-none">
                {rightSlot}
              </div>
            )}
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1.5 font-sans">{error}</p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export default FloatingInput;
