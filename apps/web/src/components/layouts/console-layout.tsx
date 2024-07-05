"use client";

import { ModeToggle } from "@/components/header/mode-toggle";
import Link from "next/link";
import { ReactNode } from "react";
import { UserAccountNav } from "@/components/user-account-nav";
import { MaxWidth } from "@hexa/ui/max-width";
import { NavLogo } from "@hexa/ui/nav-logo";

export function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 flex h-16 items-center border-b bg-background">
        <MaxWidth>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="hidden sm:block">
                <NavLogo />
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <ModeToggle />
              <UserAccountNav />
            </div>
          </div>
        </MaxWidth>
      </header>
      {children}
    </div>
  );
}
