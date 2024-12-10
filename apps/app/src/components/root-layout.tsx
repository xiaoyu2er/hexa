import { GeistSans } from '@hexa/ui/font';
import type { Metadata } from 'next';

import { Toaster } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils';
import '@hexa/tailwind-config/globals.css';
import { Provider as NiceModalProvider } from '@/components/modal';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { NextUIProvider } from '@/components/providers/nextui-provider';
import { QueryClientProvider } from '@/components/providers/query-client-provider';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: NEXT_PUBLIC_APP_NAME,
  description: 'Infinite Possibilities with a Single Link',
};

export function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'relative min-h-screen w-full scroll-smooth bg-background antialiased',
          GeistSans.className
        )}
      >
        <QueryClientProvider>
          <NiceModalProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextUIProvider>{children}</NextUIProvider>
              <Toaster richColors position="top-center" />
              <TailwindIndicator />
              <ReactQueryDevtools initialIsOpen={false} />

              {/* <Analytics /> */}
              {/* <SpeedInsights /> */}
            </ThemeProvider>
          </NiceModalProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
