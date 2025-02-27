// app/providers.tsx
'use client';

import { HeroUIProvider as InnerHeroUIProvider } from '@heroui/react';
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

export function HeroUIProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <InnerHeroUIProvider navigate={router.push}>{children}</InnerHeroUIProvider>
  );
}
