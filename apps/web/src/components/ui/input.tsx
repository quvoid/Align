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
            "flex h-12 w-full rounded-2xl bg-surface px-4 text-[15px] text-text-primary shadow-field placeholder:text-text-secondary transition-shadow focus:outline-none focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-55",
            error && "shadow-[inset_0_0_0_2px_var(--color-error)]",
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
