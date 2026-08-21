import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  fallback, 
  className 
}: { 
  src?: string | null; 
  alt?: string; 
  fallback?: string; 
  className?: string;
}) => {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100", className)}>
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium text-gray-500">
          {fallback ? fallback : <User className="h-5 w-5" />}
        </div>
      )}
    </div>
  );
};
