'use client';

import { ExternalLinkIcon } from '@hexa/ui/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@hexa/ui/badge';
import { LogoIcon } from '@hexa/ui/icons';
import { cn } from '@hexa/utils';

import { docsConfig } from '@/config/www/docs';
import { siteConfig } from '@/config/www/site';
import type { FC } from 'react';

export const MainNav: FC = () => {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="relative mr-6 flex items-center space-x-2">
        <LogoIcon className="size-6" />
        <span className="hidden font-bold md:inline-block">
          {siteConfig.name}
        </span>
        <Badge variant="secondary">Beta</Badge>
      </Link>
      <nav className="hidden items-center space-x-6 font-medium text-sm xl:flex">
        {docsConfig.mainNav.map((item) => (
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
        ))}
      </nav>
    </div>
  );
};
