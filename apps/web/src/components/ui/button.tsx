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
  // Outlined blocks with a hard shadow; on tap they slide into the shadow
  // (`brut-press`). `accent` is the taxi-yellow CTA — one per view; `primary`
  // is the ink button for a strong second action; `outline` is white;
  // `ghost` is a plain text link.
  const variants = {
    primary: 'bg-ink text-white brut-btn hover:bg-accent-hover',
    accent: 'bg-action text-ink brut-btn hover:bg-action-hover',
    outline: 'bg-surface text-primary brut-btn hover:bg-muted',
    ghost: 'bg-transparent text-primary underline decoration-2 underline-offset-4 hover:decoration-action',
  };

  const sizes = {
    sm: 'min-h-10 px-3.5 py-2 text-[14px] font-bold rounded-md',
    md: 'min-h-12 px-5 py-3 text-[15px] font-extrabold rounded-md',
    lg: 'min-h-14 px-6 py-3.5 text-[17px] font-extrabold rounded-md',
  };

  return (
    <button
      className={cn(
        "relative flex items-center justify-center select-none cursor-pointer leading-none",
        variant !== 'ghost' && "brut-press",
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
