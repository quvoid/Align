'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-border shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-primary mb-2">Something went wrong</h1>
        <p className="text-xs text-text-secondary mb-6 leading-relaxed">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="accent"
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
