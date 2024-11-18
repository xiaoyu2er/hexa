import { buttonVariants } from '@hexa/ui/button';
import { ChevronRight } from '@hexa/ui/icons';
import { Separator } from '@hexa/ui/separator';
import { cn } from '@hexa/utils';
import Link from 'next/link';

export default function Hero() {
  const post = { href: null, title: 'Introducing Hexa' };

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
          🎉 <Separator className="mx-2 h-4" orientation="vertical" />
          {post.title}
          <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
        </Link>
      )}
      <div className="relative flex flex-col gap-4 md:items-center lg:flex-row">
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
      </div>

      <p className="text-balance text-left text-base text-black tracking-tight md:text-center md:text-lg dark:font-medium dark:text-white">
        Transform your links into intelligent gateways. <br />
        Dynamically route users based on <b>location</b>, <b>time</b>,
        <b>device</b>, or run <b>A/B experiments</b> - all through a single URL.
        <br />
        Track clicks in real-time and collaborate seamlessly with
        <b>multi-workspace support</b>.
        <br />
        Built with modern stack (<b>Next.js</b>, <b>shadcn/ui</b>) and powered
        by <b>Cloudflare</b>'s global edge network for lightning-fast
        performance.
      </p>

      <div className="mx-0 flex w-full max-w-full flex-col gap-4 py-1 sm:max-w-lg sm:flex-row md:mx-auto">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-4">
          <Link
            href="/components"
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
    </div>
  );
}
