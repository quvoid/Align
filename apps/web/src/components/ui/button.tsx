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
  // Clay buttons: puffy, lit from the top-left, bounce on hover and squish on
  // tap (`clay-press`). `accent` is the grape filled CTA — the only filled
  // action colour; `primary` is butter clay; `outline` is cream clay;
  // `ghost` is a plain text link.
  const variants = {
    primary: 'bg-clay-butter text-primary shadow-clay-sm',
    accent: 'bg-accent text-white shadow-clay-btn hover:bg-accent-hover active:shadow-clay-btn-press',
    outline: 'bg-surface text-primary shadow-clay-sm hover:bg-white',
    ghost: 'bg-transparent text-primary hover:underline underline-offset-4',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-[13px] font-bold rounded-2xl',
    md: 'px-5 py-3 text-[15px] font-bold rounded-3xl',
    lg: 'px-6 py-3.5 text-base font-extrabold rounded-3xl',
  };

  return (
    <button
      className={cn(
        "relative flex items-center justify-center select-none cursor-pointer leading-none",
        variant !== 'ghost' && "clay-press",
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
