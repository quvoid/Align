"use client";

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/toast';
import { SignInModalProvider } from '@/components/auth/sign-in-modal';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <ToastProvider>
        <SignInModalProvider>{children}</SignInModalProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
