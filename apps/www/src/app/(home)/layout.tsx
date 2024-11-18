import { SiteBanner } from '@/components/site-banner';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { siteConfig } from '@/config/site';
import type { ReactNode } from 'react';

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SiteBanner href={siteConfig.links.github} title="Star on GitHub" />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <div className="before:-translate-x-1/2 pointer-events-none absolute inset-0 h-24 w-full before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[80%] before:w-[60%] before:animate-rainbow before:bg-[length:200%] before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:opacity-20 before:[filter:blur(calc(4*1rem))]" />
    </>
  );
}
