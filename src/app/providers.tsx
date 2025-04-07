'use client';

import { type ReactNode } from 'react';
import { TRPCProvider } from '@/lib/trpc';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { CartProvider } from '@/contexts/cart-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TRPCProvider>
        <CartProvider>
          <Toaster position="top-right" richColors />
          {children}
        </CartProvider>
      </TRPCProvider>
    </SessionProvider>
  );
}
