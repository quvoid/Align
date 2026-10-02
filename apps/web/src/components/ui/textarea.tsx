import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-semibold text-text-primary">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[96px] w-full rounded-3xl bg-surface px-4 py-3 text-[15px] leading-relaxed text-text-primary shadow-clay-well placeholder:text-text-secondary transition-shadow focus:outline-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/45 disabled:cursor-not-allowed disabled:opacity-55",
            error && "ring-[3px] ring-error/45",
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
Textarea.displayName = 'Textarea';
