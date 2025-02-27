import { GeistSans } from '@hexa/ui/font';

import { cn } from '@hexa/lib';
import { Toaster } from '@hexa/ui/sonner';
import '@hexa/tailwind-config/globals.css';
import { HeroUIProvider } from '@hexa/ui/heroui-provider';
import { Indicator } from '@hexa/ui/indicator';
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
          <HeroUIProvider>{children}</HeroUIProvider>
          <Toaster richColors position="top-center" />
          <Indicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
