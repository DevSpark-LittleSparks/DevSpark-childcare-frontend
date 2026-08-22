import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  error?: string;
  className?: string;
  variant?: 'default' | 'profile' | 'dark';
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, className, value, onChange, variant = 'default', ...props }, ref) => {
    
    let displayValue = value;
    if (typeof value === 'string') {
      displayValue = value.replace(/^\+94\s?/, '');
    }

    const variants = {
      default: {
        container: "rounded-xl border border-slate-200 bg-slate-50 focus-within:border-cyan-500",
        divider: "border-slate-200 py-3",
        prefixText: "text-slate-500 font-normal leading-tight mt-[2px]",
        input: "py-3 text-slate-900 font-normal leading-tight",
      },
      profile: {
        container: "rounded-2xl border-2 border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0f172a] focus-within:border-primary-500 focus-within:bg-white shadow-sm transition-all",
        divider: "border-slate-100 dark:border-slate-800/60 py-4",
        prefixText: "text-slate-400 font-bold text-sm leading-tight mt-[2px]",
        input: "py-4 text-midnight dark:text-white font-bold text-sm leading-tight bg-transparent",
      },
      dark: {
        container: "rounded-2xl border border-white/10 bg-white/5 focus-within:border-primary-500 focus-within:bg-white/10 transition-all",
        divider: "border-white/10 py-4",
        prefixText: "text-slate-400 font-bold text-sm leading-tight mt-[2px]",
        input: "py-4 text-white font-bold text-sm leading-tight bg-transparent",
      }
    };

    const v = variants[variant];

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">
            {label}
          </label>
        )}
        <div className={cn(
          "flex w-full items-stretch overflow-hidden transition-all",
          v.container,
          props.disabled ? "opacity-60 bg-slate-50 dark:bg-slate-800/40" : "",
          error && "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500",
          className
        )}>
          <div className={`flex items-center gap-2 border-r pl-4 pr-3 select-none ${v.divider}`}>
            <img src="https://flagcdn.com/w20/lk.png" srcSet="https://flagcdn.com/w40/lk.png 2x" width="20" alt="Sri Lanka Flag" className="rounded-[2px] block object-contain" />
            <span className={v.prefixText}>+94</span>
          </div>
          <input
            ref={ref}
            type="text"
            className={cn(
              "flex-1 bg-transparent px-4 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              v.input
            )}
            placeholder="771234567"
            value={displayValue}
            onChange={onChange}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
