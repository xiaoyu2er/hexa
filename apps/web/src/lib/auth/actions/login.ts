"use server";

import { db } from "@/db";
import { LoginSchema } from "@/lib/zod/schemas/auth";
import { redirect } from "next/navigation";
import { createServerAction, ZSAError } from "zsa";
import { setSession } from "@/lib/session";
import { isHashValid } from "@/lib/utils";
import { headers } from "next/headers";

export const loginAction = createServerAction()
  .input(LoginSchema)
  .handler(async ({ input }) => {
    const form = new URLSearchParams();
    form.append("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY!);
    form.append("response", input["cf-turnstile-response"]!);
    form.append("remoteip", headers().get("x-forwarded-for") as string);

    console.log("turnstile form", form.toString());

    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form },
    );
    const json = await result.json();
    console.log("turnstile response", json);

    if (json.success === false) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "Cloudflare Turnstile failed"
          : // Human-readable error message
            "Please complete the CAPTCHA",
      );
    }

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
