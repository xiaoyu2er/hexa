"use server";

import { validateRequest } from "@/lib/auth/validate-request";
import { invalidateSession, setBlankSessionCookie } from "@/lib/session";
import { EmptySchema } from "@/lib/zod/schemas/auth";
import { redirect } from "next/navigation";
import { ZSAError } from "zsa";
import { authenticatedProcedure } from "./procedures";

export const logoutAction = authenticatedProcedure
  .createServerAction()
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
