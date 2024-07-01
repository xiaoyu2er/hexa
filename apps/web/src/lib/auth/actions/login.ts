"use server";

import { db } from "@/db";
import { LoginSchema } from "@/lib/zod/schemas/auth";
import { redirect } from "next/navigation";
import { createServerAction, ZSAError } from "zsa";
import { setSession } from "@/lib/session";
import { isHashValid } from "@/lib/utils";
import { headers } from "next/headers";
import { turnstileProcedure } from "./turnstile";

export const loginAction = turnstileProcedure
  .createServerAction()
  .input(LoginSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const existingUser = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (!existingUser) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "User does not exist"
          : "Incorrect email or password",
      );
    }

    if (!existingUser.hashedPassword) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "No password set"
          : "Incorrect email or password",
      );
    }

    const validPassword = await isHashValid(
      existingUser.hashedPassword,
      password,
    );

    if (!validPassword) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "Incorrect password"
          : "Incorrect email or password",
      );
    }

    await setSession(existingUser.id);

    if (existingUser.emailVerified) {
      redirect("/");
    } else {
      redirect("/verify-email");
    }
  });
