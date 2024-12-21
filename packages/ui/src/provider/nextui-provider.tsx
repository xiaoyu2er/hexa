// app/providers.tsx
'use client';

import { NextUIProvider as InnerNextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

// Only if using TypeScript
declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function NextUIProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <InnerNextUIProvider navigate={router.push}>{children}</InnerNextUIProvider>
  );
}
