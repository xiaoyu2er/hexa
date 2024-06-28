"use client";

import { logout } from "@/lib/auth/actions";
import { Button } from "@hexa/ui";
import { useServerAction } from "zsa-react";

export const Logout = () => {
  const { execute, isPending } = useServerAction(logout);

  return (
    <Button className="mt-4" onClick={() => execute({})}>
      Log Out
    </Button>
  );
};
