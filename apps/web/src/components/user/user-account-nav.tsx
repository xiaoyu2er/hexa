"use client";

import { logoutAction } from "@/lib/actions/logout";
import { queryUserOptions } from "@/lib/queries/user";
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
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useServerAction } from "zsa-react";
import { UserAvatar } from "@/components/user/user-avatar";

export function UserAccountNav() {
  const { data: user } = useSuspenseQuery(queryUserOptions);
  const { execute: execLogout, isPending } = useServerAction(logoutAction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <UserAvatar className="h-8 w-8" user={user} />
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
