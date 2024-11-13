'use client';

import type { NavTab } from '@/types';
import { Button } from '@hexa/ui/button';
import { MaxWidth } from '@hexa/ui/max-width';
import { cn } from '@hexa/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function SettingsLayout({
  navbars,
  children,
}: {
  navbars: NavTab[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-[calc(100vh-16px)]">
      <MaxWidth>
        <div className="grid max-w-6xl items-start gap-6 py-6 md:grid-cols-[120px_1fr] lg:grid-cols-[180px_1fr] lg:py-10">
          <nav className="top-36 grid gap-1 text-muted-foreground text-sm lg:sticky">
            {navbars.map((nav) => (
              <Button
                variant="ghost"
                key={nav.name}
                className={cn('!justify-start', {
                  'text-accent-foreground': nav.href === pathname,
                  'bg-accent': nav.href === pathname,
                })}
                asChild
              >
                <Link href={nav.href}>
                  <nav.icon className="mr-2 h-4 w-4" />
                  {nav.name}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="grid gap-6">{children}</div>
        </div>
      </MaxWidth>
    </main>
  );
}
