"use client";

import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/toast';
import { SignInModalProvider } from '@/components/auth/sign-in-modal';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <ToastProvider>
        <Suspense fallback={children}>
          <SignInModalProvider>{children}</SignInModalProvider>
        </Suspense>
      </ToastProvider>
    </SessionProvider>
  );
}
