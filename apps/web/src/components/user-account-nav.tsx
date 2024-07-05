"use client";

import { logoutAction } from "@/lib/actions/logout";
import { getAvatarFallbackUrl } from "@/lib/user";
import { useSession } from "@/providers/session-provider";
import { Avatar, AvatarImage, AvatarFallback } from "@hexa/ui/avatar";
import { Button } from "@hexa/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hexa/ui/dropdown-menu";
import { Settings, LogOut } from "@hexa/ui/icons";
import Link from "next/link";
import { useServerAction } from "zsa-react";

export function UserAccountNav() {
  const { user } = useSession();
  const { execute: execLogout, isPending } = useServerAction(logoutAction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
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
  );
}
