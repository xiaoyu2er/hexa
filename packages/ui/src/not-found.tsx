import { Button, Link } from '@heroui/react';
import { APP_URL } from '@hexa/env';
import { SiteBanner } from '@hexa/ui/site-banner';
import { SiteFooter } from '@hexa/ui/site-footer';
import { SiteHeader } from '@hexa/ui/site-header';

export function NotFound() {
  return (
    <>
      <SiteBanner />
      <SiteHeader showStars={false} />
      <main className="flex-1">
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl text-gray-800">
            404 - Page Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            Oops! The page you're looking for doesn't seem to exist.
          </p>

          <Button as={Link} href={APP_URL} color="primary">
            Return Home
          </Button>
        </div>
      </main>
      <SiteFooter />
      <div className="before:-translate-x-1/2 pointer-events-none absolute inset-0 h-24 w-full before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[80%] before:w-[60%] before:animate-rainbow before:bg-[length:200%] before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:opacity-20 before:[filter:blur(calc(4*1rem))]" />
    </>
  );
}
