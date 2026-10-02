import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-semibold text-text-primary">{label}</label>}
        <select
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-2xl bg-surface px-4 text-[15px] font-semibold text-text-primary shadow-clay-sm cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/45 disabled:cursor-not-allowed disabled:opacity-55",
            error && "ring-[3px] ring-error/45",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
