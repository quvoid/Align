import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-2xl border border-stone bg-white px-3.5 py-2 text-sm placeholder:text-text-secondary focus:outline-none focus:border-text-primary disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-error">{error}</span>}
        {helperText && !error && <span className="text-xs text-text-secondary">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
