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
  const variants = {
    primary: 'bg-primary text-white hover:bg-black/85 hover:shadow-md active:bg-black shadow-xs',
    accent: 'bg-accent text-white hover:bg-accent-hover hover:shadow-md hover:shadow-accent/25 active:bg-[#d43f00] shadow-xs',
    outline: 'border border-border bg-white hover:bg-gray-50/80 text-text-primary hover:border-gray-300 hover:shadow-xs',
    ghost: 'bg-transparent hover:bg-gray-100 text-text-primary',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl',
    lg: 'px-6 py-3 text-base font-bold rounded-2xl',
  };

  return (
    <button
      className={cn(
        "relative font-medium flex items-center justify-center select-none cursor-pointer transition-all duration-200 ease-out",
        "active:scale-[0.97] active:translate-y-px hover:-translate-y-0.5",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
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
