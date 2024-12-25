import '@/styles/globals.css';
import '@/styles/sandpack.css';
import { Footer } from '@/components/footer';
import { fonts } from '@/config/fonts';
import { cn } from '@hexa/lib';
import { metadata } from '@hexa/ui/metadata';
import { RootLayout } from '@hexa/ui/root-layout';
import { SiteHeader } from '@hexa/ui/site-header';
import type { ReactNode } from 'react';

export { metadata };

export default function ({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RootLayout
      classNames={{ body: cn(fonts.sans.variable, fonts.mono.variable) }}
    >
      <SiteHeader />
      {children}
      <Footer />
    </RootLayout>
  );
}
