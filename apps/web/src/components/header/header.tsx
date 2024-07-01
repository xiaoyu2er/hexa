import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@hexa/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@hexa/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@hexa/ui/avatar";
import { LayoutDashboard, Loader2Icon } from "@hexa/ui/icons";
import { ModeToggle } from "./mode-toggle";
import { MenuButton } from "./menu-button";
import { validateRequest } from "@/lib/auth/validate-request";
import { LogoutMenuItem } from "./logout-menu-item";
import { User } from "lucia";

async function ProfileAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatarUrl!} />
      <AvatarFallback>{"AA"}</AvatarFallback>
    </Avatar>
  );
}

async function HeaderActions() {
  const { user } = await validateRequest();
  const isSignedIn = !!user;

  return (
    <>
      {isSignedIn ? (
        <>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Suspense
                fallback={
                  <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                    ..
                  </div>
                }
              >
                <ProfileAvatar user={user} />
              </Suspense>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
              <LogoutMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="md:hidden">
            <MenuButton />
          </div>
        </>
      ) : (
        <>
          <ModeToggle />
          <Button asChild variant="secondary">
            <Link href="/login">Log In</Link>
          </Button>
        </>
      )}
    </>
  );
}

export async function Header() {
  const { user } = await validateRequest();

  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <Link href="/" className="flex gap-2 items-center text-xl">
            <div className="hidden md:block">Hexa</div>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <Button
                variant={"link"}
                asChild
                className="flex items-center justify-center gap-2"
              >
                <Link href={"/dash"}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-40">
                <Loader2Icon className="animate-spin w-4 h-4" />
              </div>
            }
          >
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
