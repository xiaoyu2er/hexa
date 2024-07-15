"use client";

import type { NavTab } from "@/types";
import { Button } from "@hexa/ui/button";
import { MaxWidth } from "@hexa/ui/max-width";
import { cn } from "@hexa/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsLayout({
  navbars,
  children,
}: {
  navbars: NavTab[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-[calc(100vh-16px)]">
      <MaxWidth>
        <div className="py-6 lg:py-10 grid max-w-6xl items-start gap-6 md:grid-cols-[120px_1fr] lg:grid-cols-[180px_1fr]">
          <nav className="grid text-sm text-muted-foreground lg:sticky top-36 gap-1">
            {navbars.map((nav) => (
              <Button
                variant="ghost"
                key={nav.name}
                className={cn("!justify-start", {
                  "text-accent-foreground": nav.href === pathname,
                  "bg-accent": nav.href === pathname,
                })}
                asChild
              >
                <Link href={nav.href}>
                  <nav.icon className="w-4 h-4 mr-2" />
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
