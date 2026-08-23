import React from 'react';
import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-[#22D3EE] text-white hover:bg-[#0891B2] shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-sm font-bold',
      secondary: 'bg-[#F0FDFF] text-[#22D3EE] hover:bg-[#CFFAFE] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-sm font-bold',
      outline: 'border-2 border-[#14B8A6] text-[#14B8A6] hover:bg-[#F0FAF9] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95',
      ghost: 'text-[#14B8A6] hover:bg-[#F0FAF9] transition-all duration-300 active:scale-95',
      danger: 'bg-red-500 text-white hover:bg-red-600 transition-all duration-300 active:scale-95',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg font-semibold rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
