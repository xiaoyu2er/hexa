"use client";

import { ModeToggle } from "@/components/header/mode-toggle";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { UserAccountNav } from "@/components/user/user-account-nav";
import { MaxWidth } from "@hexa/ui/max-width";
import { NavLogo } from "@hexa/ui/nav-logo";
import { WorkspaceSwitcher } from "@/components/workspaces/workspace-switcher";
import { Skeleton } from "@hexa/ui/skeleton";
import NavTabs from "./nav-tabs";

export function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 flex items-center border-b bg-background">
        <MaxWidth>
          <div className="flex h-16 items-center justify-between ">
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden sm:block">
                <NavLogo />
              </Link>
              <Suspense fallback={<Skeleton className="h-4 w-[250px]" />}>
                <WorkspaceSwitcher />
              </Suspense>
            </div>
            <div className="flex items-center space-x-6">
              <ModeToggle />
              <Suspense fallback={<Skeleton className="h-8 w-8" />}>
                <UserAccountNav />
              </Suspense>
            </div>
          </div>
          <NavTabs />
        </MaxWidth>
      </header>
      {children}
    </div>
  );
}
