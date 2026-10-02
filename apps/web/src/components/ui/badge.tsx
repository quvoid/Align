import { cn } from '@/lib/utils';

/** Status pills: soft tint, one per pitch status, same words on both sides. */
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
    pending: 'bg-tint-butter',
    approved: 'bg-tint-mint',
    rejected: 'bg-tint-rose',
    under_review: 'bg-tint-sky',
    shortlisted: 'bg-tint-lilac',
    withdrawn: 'bg-tint-cloud',
    default: 'bg-surface',
  };

  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-primary whitespace-nowrap", variants[variant], className)}>
      {children}
    </span>
  );
};
