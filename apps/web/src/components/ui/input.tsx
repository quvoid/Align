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
        {label && <label className="text-sm font-extrabold text-text-primary">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-md bg-surface px-4 text-[16px] font-medium text-text-primary brut-well placeholder:text-text-secondary transition-[box-shadow,background-color] focus:outline-none focus-visible:outline-none focus-visible:bg-[#FFFCEB] focus-visible:shadow-[3px_3px_0_0_#111] disabled:cursor-not-allowed disabled:opacity-55",
            error && "border-error shadow-[3px_3px_0_0_var(--color-error)]",
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
