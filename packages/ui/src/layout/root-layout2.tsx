import '@hexa/tailwind-config/globals.css';
import { RootLayout as InnerRootLayout } from '@hexa/ui/root-layout';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { QueryClientProvider } from '@hexa/ui/query-client-provider';
import type { ReactNode } from 'react';

export function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <InnerRootLayout>
      <QueryClientProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </InnerRootLayout>
  );
}
