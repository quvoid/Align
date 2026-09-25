import { cn } from "@/lib/utils";

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}) => {
  // DESIGN.md: buttons are flat (no shadow), radius 16px at every size, the accent reserved
  // as the sole filled high-emphasis color. `primary` is the soft-cyan filled variant,
  // `accent` is the raspberry-plum filled CTA, `outline` is the ghost-outline secondary action,
  // `ghost` is the borderless tertiary text link.
  const variants = {
    primary: 'bg-highlight text-primary hover:bg-highlight/85 active:bg-highlight',
    accent: 'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover',
    outline: 'border border-primary bg-transparent text-primary hover:bg-primary hover:text-background',
    ghost: 'bg-transparent text-primary hover:underline underline-offset-4',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-2xl',
    md: 'px-5 py-3 text-sm font-semibold rounded-2xl',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl',
  };

  return (
    <button
      className={cn(
        "relative font-medium flex items-center justify-center select-none cursor-pointer transition-all duration-200 ease-out",
        "active:scale-[0.97] hover:-translate-y-0.5",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
