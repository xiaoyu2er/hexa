import { RootLayout, metadata } from '@/components/root-layout';
import { SiteBanner } from '@/components/www/site-banner';
import { SiteFooter } from '@/components/www/site-footer';
import { SiteHeader } from '@/components/www/site-header';
import type { ReactNode } from 'react';
export { metadata };
export default function NotFoundLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RootLayout>
      <SiteBanner />
      <SiteHeader showStars={false} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <div className="before:-translate-x-1/2 pointer-events-none absolute inset-0 h-24 w-full before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[80%] before:w-[60%] before:animate-rainbow before:bg-[length:200%] before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:opacity-20 before:[filter:blur(calc(4*1rem))]" />
    </RootLayout>
  );
}
