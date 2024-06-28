"use server";

import { db, userTable } from "@/db";
import { SignupSchema, OTPSchema, EmptySchema } from "@/lib/zod/schemas/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerAction, ZSAError } from "zsa";
import { lucia } from "@/lib/auth/lucia";
import { validateRequest } from "@/lib/auth/validate-request";
import {
  getHash,
  generateUserId,
  sendVerificationCodeEmail,
  addDBToken,
  resendVerifyTokenEmail,
  verifyDBTokenByCode,
} from "./utils";

export const signupAction = createServerAction()
  .input(SignupSchema)
  .handler(async ({ input }) => {
    const request = await validateRequest();
    if (request.user?.id) {
      await lucia.invalidateUserSessions(request.user.id);
    }
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
      const userId = generateUserId();
      const hashedPassword = await getHash(password);

      user = (
        await db
          .insert(userTable)
          .values({
            id: userId,
            email,
            hashedPassword,
          })
          .returning()
      )[0];

      console.log("User updated", user);
    }

    if (!user) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create user");
    }

    const { code: verificationCode } = await addDBToken(
      user.id,
      "VERIFY_EMAIL",
    );

    await sendVerificationCodeEmail(email, verificationCode);

    const newSession = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(newSession.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    redirect("/verify-email");
  });

export const resendVerifyEmailAction = createServerAction()
  .input(EmptySchema)
  .handler(async () => {
    const { user } = await validateRequest();
    if (!user?.email) {
      return redirect("/login");
    }

    return resendVerifyTokenEmail(user, "VERIFY_EMAIL");
  });

export const verifyEmailAction = createServerAction()
  .input(OTPSchema)
  .handler(async ({ input }) => {
    const { code } = input;
    const { user } = await validateRequest();

    // No session
    if (!user) {
      throw new ZSAError(
        "FORBIDDEN",
        "Access to this verify email is forbidden",
      );
    }

    await verifyDBTokenByCode({ id: user.id }, { code }, "VERIFY_EMAIL", true);

    // Mathcing code
    // Update session
    await lucia.invalidateUserSessions(user.id);
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, user.id));
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // Redirect to home
    return redirect("/");
  });
