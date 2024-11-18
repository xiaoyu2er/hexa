import type { Metadata } from 'next';
import '@hexa/ui/globals.css';
import { GeistSans } from '@hexa/ui/font';
import { Toaster } from '@hexa/ui/sonner';
import { TooltipProvider } from '@hexa/ui/tooltip';
import { cn } from '@hexa/utils';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hexa',
  description: 'Infinite Possibilities with a Single Link',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'relative min-h-screen w-full scroll-smooth bg-background antialiased',
          GeistSans.className
        )}
      >
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
