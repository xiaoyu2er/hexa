// In Next.js, this file would be called: app/providers.jsx
'use client';

import { QueryClientProvider as InnerQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import type { ReactNode } from 'react';
import { getQueryClient } from './get-query-client2';

export function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <InnerQueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {children}
        <ReactQueryDevtools />
      </ReactQueryStreamedHydration>
    </InnerQueryClientProvider>
  );
}
