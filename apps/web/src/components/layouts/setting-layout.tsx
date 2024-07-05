"use client";

import { MaxWidth } from "@hexa/ui/max-width";
import { cn } from "@hexa/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsNavbar {
  name: string;
  href: string;
}

export function SettingsLayout({
  navbars,
  children,
}: {
  navbars: SettingsNavbar[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-[calc(100vh-16px)]">
      <div className="flex h-36 items-center border-b">
        <MaxWidth>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>
        </MaxWidth>
      </div>

      <MaxWidth>
        <div className="py-6 lg:py-10 grid max-w-6xl items-start gap-6 md:grid-cols-[120px_1fr] lg:grid-cols-[180px_1fr]">
          <nav className="grid text-sm text-muted-foreground lg:sticky top-36">
            {navbars.map((nav) => (
              <Link
                key={nav.name}
                href={nav.href}
                className={cn(
                  "rounded-md p-2.5 text-md transition-all duration-75 hover:bg-gray-100 active:bg-gray-200",
                  {
                    "font-extrabold": nav.href === pathname,
                  }
                )}
              >
                {nav.name}
              </Link>
            ))}
          </nav>
          <div className="grid gap-6">{children}</div>
        </div>
      </MaxWidth>
    </main>
  );
}
