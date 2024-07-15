"use client";

import { ModeToggle } from "@/components/header/mode-toggle";
import { UserAccountNav } from "@/components/user/user-account-nav";
import { WorkspaceSwitcher } from "@/components/workspaces/workspace-switcher";
import { MaxWidth } from "@hexa/ui/max-width";
import { NavLogo } from "@hexa/ui/nav-logo";
import { Skeleton } from "@hexa/ui/skeleton";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import NavTabs from "./nav-tabs";

export function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 flex items-center border-b bg-background z-10">
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
