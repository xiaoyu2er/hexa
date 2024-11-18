import { ChevronRight } from '@hexa/ui/icons';
import Link from 'next/link';

import TechStack from '@/components/tech-stack';
import { buttonVariants } from '@hexa/ui/button';
import { Separator } from '@hexa/ui/separator';
import { cn } from '@hexa/utils';

export default function Hero() {
  const post = { href: '/', title: 'Introducing Hexa' };

  return (
    <section id="hero">
      <div className="relative h-full overflow-hidden py-5 md:py-14">
        <div className="z-10 flex flex-col">
          <div className="mt-10 grid grid-cols-1 md:mt-20">
            <div className="flex flex-col items-start gap-6 px-7 pb-8 text-center md:items-center md:px-10">
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

              <p className="max-w-xl text-balance text-left text-base text-black tracking-tight md:text-center md:text-lg dark:font-medium dark:text-white">
                Universal URL shortener platform that delivers multiple
                destinations based on <b>region</b>, <b>time</b>,
                <b>A/B tests</b>, and more.
                <br />
                Open-source and powered by <b>Next.js</b>, <b>shadcn/ui</b>, and
                <b>Cloudflare</b>'s edge infrastructure.
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
                    Browse Components
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
                    Browse Templates
                    <ChevronRight className="ml-1 size-4 shrink-0 transition-all duration-300 ease-out group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-56 items-center justify-center">
            <TechStack
              className="mx-auto flex w-full items-center justify-between"
              technologies={[
                'react',
                'typescript',
                'tailwindcss',
                'framermotion',
                'shadcn',
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
