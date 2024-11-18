'use client';

import NavTabs from '@/components/menu-bar/nav-tabs';
import { ModeToggle } from '@hexa/ui/mode-toggle';

import { ContextSwitcher } from '@/components/menu-bar/context-switcher';
import { New } from '@/components/menu-bar/new';
import { UserAccountNav } from '@/components/menu-bar/user-account-nav';
import { LogoIcon } from '@hexa/ui/icons';
import { MaxWidth } from '@hexa/ui/max-width';
import { Skeleton } from '@hexa/ui/skeleton';
import Link from 'next/link';
import { Suspense } from 'react';

export const MenuBar = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center border-b bg-background">
      <MaxWidth>
        <div className="flex h-16 items-center justify-between ">
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden sm:block">
              <LogoIcon />
            </Link>
            <Suspense fallback={<Skeleton className="h-4 w-[250px]" />}>
              <ContextSwitcher />
            </Suspense>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <New />
            <UserAccountNav />
          </div>
        </div>
        <NavTabs />
      </MaxWidth>
    </header>
  );
};
