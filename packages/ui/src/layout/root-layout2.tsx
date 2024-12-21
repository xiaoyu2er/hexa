import '@hexa/tailwind-config/globals.css';
import { NiceModalProvider } from '@hexa/ui/modal-provider';
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
        <NiceModalProvider>{children}</NiceModalProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </InnerRootLayout>
  );
}
