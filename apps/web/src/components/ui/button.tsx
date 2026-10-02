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
  // Pills with no borders or shadows; tap shrinks them a touch (`press`).
  // `accent` is the ink CTA — the one action per view; `primary` is an oat
  // pill for a second action; `outline` is white with a hairline; `ghost` is
  // a plain text link.
  const variants = {
    primary: 'bg-muted text-primary hover:bg-[#E6E1D6]',
    accent: 'bg-ink text-white hover:bg-accent-hover',
    outline: 'bg-surface text-primary shadow-field hover:bg-muted',
    ghost: 'bg-transparent text-primary hover:underline underline-offset-4',
  };

  const sizes = {
    sm: 'min-h-10 px-4 py-2 text-[14px] font-medium rounded-full',
    md: 'min-h-12 px-5 py-3 text-[15px] font-semibold rounded-full',
    lg: 'min-h-13 px-6 py-3.5 text-base font-semibold rounded-full',
  };

  return (
    <button
      className={cn(
        "relative flex items-center justify-center select-none cursor-pointer leading-none",
        variant !== 'ghost' && "press",
        "disabled:opacity-55 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
