import { GeistSans } from '@hexa/ui/font';

import { cn } from '@hexa/lib';
import { Toaster } from '@hexa/ui/sonner';
import '@hexa/tailwind-config/globals.css';
import { Indicator } from '@hexa/ui/indicator';
import { NextUIProvider } from '@hexa/ui/nextui-provider';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@hexa/ui/theme-provider';

export function RootLayout({
  children,
  classNames,
}: Readonly<{
  children: ReactNode;
  classNames?: {
    body?: string;
  };
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'relative min-h-screen w-full scroll-smooth bg-background antialiased',
          GeistSans.className,
          classNames?.body
        )}
      >
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
      </body>
    </html>
  );
}
