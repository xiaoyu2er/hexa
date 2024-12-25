'use client';
import { siteConfig } from '@hexa/const/config/site';
import { Badge } from '@hexa/ui/badge';
import { LogoIcon } from '@hexa/ui/icons';
import { NavigationMenuDemo } from '@hexa/ui/nav-menu';
import Link from 'next/link';
import type { FC } from 'react';

export const MainNav: FC = () => {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="flex relative mr-6  items-center space-x-2 ">
        <LogoIcon />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
        <Badge variant="secondary" className="hidden lg:inline-block">
          Beta
        </Badge>
      </Link>
      <nav className="items-center space-x-6 font-medium text-sm">
        {/* {docsConfig.mainNav.map((item) => (
          <Link
            key={item.title}
            href={item.href ?? ''}
            aria-label={item.title}
            target={item.external ? '_blank' : undefined}
            className={cn(
              'flex items-center justify-center transition-colors hover:text-foreground/80',
              pathname?.startsWith(item.href ?? '')
                ? 'text-foreground'
                : 'text-foreground/60'
            )}
          >
            <span className="shrink-0">{item.title}</span>
            {item.label && (
              <span className="ml-2 rounded-md bg-[#FFBD7A] px-1.5 py-0.5 text-[#000000] text-xs leading-none no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
            {item.external && <ExternalLinkIcon className="ml-2 size-4" />}
          </Link>
        ))} */}
        <NavigationMenuDemo />
      </nav>
    </div>
  );
};
