import { cn } from '@/lib/utils';

/** Status pills in clay. One colour per pitch status, same words on both sides. */
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
    pending: 'bg-clay-butter',
    approved: 'bg-clay-mint',
    rejected: 'bg-clay-rose',
    under_review: 'bg-clay-sky',
    shortlisted: 'bg-clay-lilac',
    withdrawn: 'bg-clay-cloud',
    default: 'bg-surface',
  };

  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-primary shadow-clay-sm whitespace-nowrap", variants[variant], className)}>
      {children}
    </span>
  );
};
