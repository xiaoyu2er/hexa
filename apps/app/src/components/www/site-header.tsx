import { buttonVariants } from '@hexa/ui/button';
import { GithubIcon, StarIcon, TwitterIcon } from '@hexa/ui/icons';
import { ModeToggle } from '@hexa/ui/mode-toggle';
import NumberTicker from '@hexa/ui/number-ticker';
import { cn } from '@hexa/utils';
import Link from 'next/link';

import { siteConfig } from '@/config/www/site';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';

export async function SiteHeader() {
  let stars = 300; // Default value

  try {
    const response = await fetch(
      'https://api.github.com/repos/xiaoyu2er/hexa',
      {
        headers: process.env.GITHUB_OAUTH_TOKEN
          ? {
              Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
              'Content-Type': 'application/json',
            }
          : {},
        next: {
          revalidate: 3600,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      stars = data.stargazers_count || stars; // Update stars if API response is valid
    }
  } catch (_error) {}

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-background/40 backdrop-blur-lg supports-backdrop-blur:bg-background/90'
      )}
    >
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <Link
            className={cn(
              buttonVariants({
                variant: 'rainbow',
              }),
              'hidden md:inline-flex'
            )}
            target="_blank"
            href={siteConfig.links.github}
          >
            <div className="flex items-center">
              <GithubIcon className="size-4" />
              <span className="ml-1 lg:hidden">Star</span>
              <span className="ml-1 hidden lg:inline">Star on GitHub</span>
            </div>
            <div className="ml-2 flex items-center gap-1 text-sm md:flex">
              <StarIcon className="size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300" />
              <NumberTicker
                value={stars}
                className="font-display font-medium text-white dark:text-black"
              />
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <GithubIcon className="size-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <TwitterIcon className="size-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-200/30 to-neutral-200/0" />
    </header>
  );
}
