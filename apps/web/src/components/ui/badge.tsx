import { cn } from '@/lib/utils';

/** Status pills: outlined, one fill per pitch status, same words on both sides. */
export const Badge = ({
  variant = 'pending',
  children,
  className
}: {
  variant?: 'pending' | 'approved' | 'rejected' | 'under_review' | 'shortlisted' | 'withdrawn' | 'default';
  children: React.ReactNode;
  className?: string;
}) => {
  const variants = {
    pending: 'bg-fill-butter',
    approved: 'bg-fill-mint',
    rejected: 'bg-fill-rose',
    under_review: 'bg-fill-sky',
    shortlisted: 'bg-fill-lilac',
    withdrawn: 'bg-fill-cloud',
    default: 'bg-surface',
  };

  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold text-primary brut-flat whitespace-nowrap", variants[variant], className)}>
      {children}
    </span>
  );
};
