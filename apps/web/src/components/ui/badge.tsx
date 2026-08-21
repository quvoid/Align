import { cn } from '@/lib/utils';

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
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-error/10 text-error border-error/20',
    under_review: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    shortlisted: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    withdrawn: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
};
