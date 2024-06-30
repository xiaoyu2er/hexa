"use server";

import { redirect } from "next/navigation";
import { createServerAction, ZSAError } from "zsa";
import { validateRequest } from "../validate-request";
import { EmptySchema } from "@/lib/zod/schemas/auth";
import { invalidateSession, setBlankSessionCookie } from "@/lib/session";

export const logoutAction = createServerAction()
  .input(EmptySchema)
  .handler(async () => {
    const { session } = await validateRequest();
    if (!session) {
      throw new ZSAError("FORBIDDEN", "User is not authenticated");
    }
    await invalidateSession(session.id);
    setBlankSessionCookie();
    return redirect("/");
  });
