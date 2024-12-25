'use client';
import { cn } from '@hexa/lib';
import { GithubIcon } from '@hexa/ui/icons';
import { ModeToggle } from '@hexa/ui/mode-toggle';

import { siteConfig } from '@hexa/const/config/site';
import { Button } from '@nextui-org/react';
import {} from 'react';
import { MobileNav } from './mobile-nav';

import {} from '@hexa/ui/navigation-menu';

import { MainNav } from '@hexa/ui/main-nav';
import Link from 'next/link';

interface SiteHeaderProps {
  showStars?: boolean;
}
export function SiteHeader({ showStars = true }: SiteHeaderProps) {
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
          <nav className="flex items-center gap-1">
            <Button
              as={Link}
              href={siteConfig.links.github}
              target="_blank"
              size="sm"
              rel="noreferrer"
              isIconOnly
              variant="light"
              aria-label="GitHub"
              className="min-w-8"
            >
              <GithubIcon className="h-4 w-4" />
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-200/30 to-neutral-200/0" />
    </header>
  );
}
