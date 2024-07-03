"use client";

import { cn } from "@hexa/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SETTINGS_NAVBARS = [
  {
    name: "General",
    href: "/settings",
  },
  {
    name: "Security",
    href: "/settings/security",
  },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid text-sm text-muted-foreground">
          {SETTINGS_NAVBARS.map((nav) => (
            <Link
              key={nav.name}
              href={nav.href}
              className={cn(
                "rounded-md p-2.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200",
                {
                  "font-semibold text-black": nav.href === pathname,
                }
              )}
            >
              {nav.name}
            </Link>
          ))}
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </main>
  );
}
