"use client";

import { logoutAction } from "@/lib/actions/logout";
import { DropdownMenuItem } from "@hexa/ui/dropdown-menu";
import { Loader2Icon, LogOut } from "@hexa/ui/icons";
import { useServerAction } from "zsa-react";

export const LogoutMenuItem = () => {
  const { execute, isPending } = useServerAction(logoutAction);

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={() => execute({})}>
      {isPending ? (
        <Loader2Icon className="w-4 h-4 mr-2" />
      ) : (
        <LogOut className="w-4 h-4 mr-2" />
      )}
      Log Out
    </DropdownMenuItem>
  );
};
