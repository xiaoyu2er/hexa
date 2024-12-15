import { APP_URL } from '@/lib/env';
import { buttonVariants } from '@hexa/ui/button';
import { ChevronRight } from '@hexa/ui/icons';
import { cn } from '@hexa/utils';
import { Divider } from '@nextui-org/react';
import Link from 'next/link';
export default function Hero() {
  const post = { href: '/blog/introducing-hexa', title: 'Introducing Hexa' };

  return (
    <div
      className="relative flex h-full flex-col items-start gap-6 overflow-hidden px-7 py-5 pb-8 text-center md:items-center md:px-10 md:py-14"
      id="hero"
    >
      {post.href && (
        <Link
          href={post.href}
          className={cn(
            buttonVariants({
              variant: 'outline',
              size: 'sm',
            }),
            'rounded-full'
          )}
        >
          🎉 <Divider className="mx-2 h-3" orientation="vertical" />
          {post.title}
          <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
        </Link>
      )}

      <div className="flex flex-col gap-6 text-balance md:items-center">
        <h1
          className={cn(
            'text-black dark:text-white',
            'relative mx-0 pt-5 md:mx-auto md:px-4 md:py-2',
            'text-balance text-left font-semibold tracking-tighter md:text-center',
            'text-5xl sm:text-7xl md:text-7xl lg:text-7xl'
          )}
        >
          One Link, Infinite Possibilities
        </h1>

        <h2 className="relative mx-0 text-balance text-left font-semibold text-2xl tracking-tighter md:text-center">
          Transform links into intelligent gateways.
        </h2>

        <div className="space-y-2 text-left text-base text-muted-foreground tracking-tight md:text-center md:text-lg">
          <p>
            Route users by
            <span className="mx-1 font-semibold">
              location, time, device, or A/B tests
            </span>
            with a single URL.
          </p>
          <p>Track clicks in real-time with multi-workspace collaboration</p>
          <p>
            Built with Next.js & shadcn/ui, powered by Cloudflare's edge network
          </p>
        </div>
      </div>

      <div className="mx-0 flex w-full max-w-full flex-col gap-2 py-1 sm:max-w-lg sm:flex-row sm:gap-4">
        <Link
          href={`${APP_URL}/login`}
          className={cn(
            buttonVariants({
              variant: 'default',
              size: 'lg',
            }),
            'w-full gap-2'
          )}
        >
          Get Started
          <ChevronRight className="ml-1 size-4 shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
        </Link>
        <Link
          href="https://pro.magicui.design"
          className={cn(
            buttonVariants({
              size: 'lg',
              variant: 'outline',
            }),
            'w-full gap-2'
          )}
        >
          Learn More
          <ChevronRight className="ml-1 size-4 shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
