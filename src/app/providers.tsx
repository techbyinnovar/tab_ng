'use client';

import { type ReactNode } from 'react';
import { TRPCProvider } from '@/lib/trpc';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TRPCProvider>
        <Toaster position="top-right" richColors />
        {children}
      </TRPCProvider>
    </SessionProvider>
  );
}
