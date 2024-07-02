"use server";

import { db, userTable } from "@/db";
import {
  SignupSchema,
  OTPSchema,
  OnlyEmailSchema,
} from "@/lib/zod/schemas/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createServerAction, ZSAError } from "zsa";
import {
  sendVerificationCodeEmail,
  addDBToken,
  resendVerifyTokenEmail,
  verifyDBTokenByCode,
} from "./utils";
import { createUser, getUserByEmail } from "@/db/data-access/user";
import { getHash } from "@/lib/utils";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { turnstileProcedure } from "./turnstile";

export const signupAction = turnstileProcedure
  .createServerAction()
  .input(SignupSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const existingUser = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (existingUser && existingUser.emailVerified) {
      throw new ZSAError("FORBIDDEN", "User already exists");
    }

    let user = existingUser;

    if (existingUser) {
      const hashedPassword = await getHash(password);
      if (hashedPassword !== existingUser?.hashedPassword) {
        // update the password
        user = (
          await db
            .update(userTable)
            .set({ hashedPassword })
            .where(eq(userTable.id, existingUser.id))
            .returning()
        )[0];
        console.log("User updated", user);
      }
    } else {
      user = await createUser({
        email,
        emailVerified: false,
        password,
        avatarUrl: null,
      });

      console.log("User updated", user);
    }

    if (!user) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create user");
    }

    const { code: verificationCode } = await addDBToken(
      user.id,
      "VERIFY_EMAIL",
    );

    const data = await sendVerificationCodeEmail(email, verificationCode);

    console.log("send a email", email, data);
    return {
      email,
    };
  });

export const resendVerifyEmailAction = createServerAction()
  .input(OnlyEmailSchema)
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await getUserByEmail(email);
    if (!user) {
      throw new ZSAError("FORBIDDEN", "User not found");
    }

    return resendVerifyTokenEmail(user, "VERIFY_EMAIL");
  });

export const verifyEmailAction = createServerAction()
  .input(OTPSchema)
  .handler(async ({ input }) => {
    const { code, email } = input;
    const user = await getUserByEmail(email);

    if (!user) {
      throw new ZSAError("FORBIDDEN", "User not found");
    }

    await verifyDBTokenByCode({ id: user.id }, { code }, "VERIFY_EMAIL", true);

    // Mathcing code
    // Update session
    await invalidateUserSessions(user.id);
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, user.id));

    await setSession(user.id);

    redirect("/settings");
  });
