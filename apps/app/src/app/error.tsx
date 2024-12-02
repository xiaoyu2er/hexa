'use client';

import { SiteBanner } from '@/components/www/site-banner';
import { SiteFooter } from '@/components/www/site-footer';
import { SiteHeader } from '@/components/www/site-header';
import { Button } from '@hexa/ui/button';
import Link from 'next/link';
import type { ReactElement } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): ReactElement {
  return (
    <>
      <SiteBanner />
      <SiteHeader showStars={false} />
      <main className="flex-1">
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl text-gray-800">
            500 - Internal Server Error
          </h1>
          <p className="mb-6 text-gray-600">{error.message}</p>

          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
      <div className="before:-translate-x-1/2 pointer-events-none absolute inset-0 h-24 w-full before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[80%] before:w-[60%] before:animate-rainbow before:bg-[length:200%] before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:opacity-20 before:[filter:blur(calc(4*1rem))]" />
    </>
  );
}
