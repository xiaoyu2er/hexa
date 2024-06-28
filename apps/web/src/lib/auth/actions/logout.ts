"use server";

import { cookies } from "next/headers";

import { lucia } from "@/lib/auth/lucia";

import { redirect } from "next/navigation";
import { createServerAction, ZSAError } from "zsa";
import { validateRequest } from "../validate-request";
import { EmptySchema } from "@/lib/zod/schemas/auth";

export const logoutAction = createServerAction()
  .input(EmptySchema)
  .handler(async () => {
    const { session } = await validateRequest();
    if (!session) {
      throw new ZSAError("FORBIDDEN", "User is not authenticated");
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  });
