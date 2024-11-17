import { inter, satoshi } from '@/styles/fonts';
import type { Metadata } from 'next';

import { Toaster } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils';
import '@hexa/ui/globals.css';
import { Provider as NiceModalProvider } from '@/components/modal';
import { QueryClientProvider } from '@/components/providers/query-client-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { getSession } from '@/lib/session';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hexa',
  description: 'Infinite Possibilities with a Single Link',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(satoshi.variable, inter.variable)}>
        <QueryClientProvider>
          <NiceModalProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SessionProvider {...session}>{children}</SessionProvider>
              <Toaster richColors position="top-center" />
              <TailwindIndicator />
              {/* <Analytics /> */}
              {/* <SpeedInsights /> */}
            </ThemeProvider>
          </NiceModalProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
