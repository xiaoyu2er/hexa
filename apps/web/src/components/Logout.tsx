"use client";

import { logoutAction } from "@/lib/auth/actions/logout";
import { Button } from "@hexa/ui/button";
import { useServerAction } from "zsa-react";

export const Logout = () => {
  const { execute } = useServerAction(logoutAction);

  return (
    <Button className="mt-4" onClick={() => execute({})}>
      Log Out
    </Button>
  );
};
