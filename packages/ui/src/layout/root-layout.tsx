import { GeistSans } from '@hexa/ui/font';

import { Toaster } from '@hexa/ui/sonner';
import { cn } from '../../../lib/src';
import '@hexa/tailwind-config/globals.css';
import { Indicator } from '@hexa/ui/indicator';
import { NiceModalProvider } from '@hexa/ui/modal-provider';
import { NextUIProvider } from '@hexa/ui/nextui-provider';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@hexa/ui/theme-provider';

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
        <NiceModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextUIProvider>{children}</NextUIProvider>
            <Toaster richColors position="top-center" />
            <Indicator />
          </ThemeProvider>
        </NiceModalProvider>
      </body>
    </html>
  );
}
