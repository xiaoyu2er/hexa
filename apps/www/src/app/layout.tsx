import { inter, satoshi } from '@/styles/fonts';
import type { Metadata } from 'next';
import '@hexa/ui/globals.css';
import { cn } from '@hexa/utils';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hexa',
  description: 'Infinite Possibilities with a Single Link',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(satoshi.variable, inter.variable)}>{children}</body>
    </html>
  );
}
