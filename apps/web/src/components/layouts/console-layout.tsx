"use client";

import { useSession } from "@/app/session-provider";
import { ModeToggle } from "@/components/header/mode-toggle";
import { logoutAction } from "@/lib/actions/logout";
import { getAvatarFallbackName, getAvatarFallbackUrl } from "@/lib/user";
import { Avatar, AvatarFallback, AvatarImage } from "@hexa/ui/avatar";
import { Button } from "@hexa/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@hexa/ui/dropdown-menu";
import { LogOut, Menu, Package2, Search, Settings } from "@hexa/ui/icons";
import { Input } from "@hexa/ui/input";
import { Sheet, SheetTrigger, SheetContent } from "@hexa/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useServerAction } from "zsa-react";

const CONSOLE_NAVBARS = [
  {
    name: "Settings",
    href: "/settings",
  },
];

export function ConsoleLayout({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const pathname = usePathname();
  const { execute: execLogout, isPending } = useServerAction(logoutAction);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Hexa</span>
          </Link>

          {CONSOLE_NAVBARS.map((navbar) => (
            <Link
              key={navbar.name}
              href={navbar.href}
              className={`${
                pathname === navbar.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              {navbar.name}
            </Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>

              {CONSOLE_NAVBARS.map((navbar) => (
                <Link
                  key={navbar.name}
                  href={navbar.href}
                  className={`${
                    pathname === navbar.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground`}
                >
                  {navbar.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage
                    src={user?.avatarUrl!}
                    alt={user?.name || "User Profile Picture"}
                  />
                  <AvatarFallback delayMs={200}>
                    <Avatar>
                      <AvatarImage
                        src={getAvatarFallbackUrl(user)}
                        alt={user?.name || "User Fallback Profile Picture"}
                      />
                    </Avatar>
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex gap-2 items-center">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  execLogout({});
                }}
                className="flex gap-2 items-center"
              >
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {children}
    </div>
  );
}
