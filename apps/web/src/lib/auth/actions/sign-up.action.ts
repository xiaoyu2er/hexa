"use server";

import { db, tokenTable, userTable } from "@/db";
import { RESEND_VERIFY_CODE_TIME_SPAN } from "@/lib/const";
import { SignupSchema, OTPSchema, EmptySchema } from "@/lib/zod/schemas/auth";
import { formatDistanceStrict } from "date-fns";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isWithinExpirationDate } from "oslo";
import { createServerAction, ZSAError } from "zsa";
import { lucia } from "@/lib/auth/lucia";
import { validateRequest } from "@/lib/auth/validate-request";
import {
  getHash,
  generateUserId,
  sendVerificationCodeEmail,
  generateDBToken,
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

    const { code: verificationCode } = await generateDBToken(
      user.id,
      "VERIFY_EMAIL"
    );

    await sendVerificationCodeEmail(email, verificationCode);

    const newSession = await lucia.createSession(user.id, {
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(newSession.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
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

    const verifyRow = await db.query.tokenTable.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.userId, user.id), eq(table.type, "VERIFY_EMAIL")),
    });

    if (verifyRow) {
      const nextSendTime = new Date(
        +verifyRow.createdAt + RESEND_VERIFY_CODE_TIME_SPAN.milliseconds()
      );

      if (isWithinExpirationDate(nextSendTime)) {
        throw new ZSAError(
          "CONFLICT",
          `Please wait ${formatDistanceStrict(new Date(), nextSendTime)} before resending`
        );
      }
    }

    const { code: verificationCode } = await generateDBToken(
      user.id,
      "VERIFY_EMAIL"
    );

    return await sendVerificationCodeEmail(user.email, verificationCode);
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
        "Access to this verify email is forbidden"
      );
    }

    const verifyRow = await db.query.tokenTable.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.userId, user.id), eq(table.type, "VERIFY_EMAIL")),
      with: {
        user: true,
      },
    });

    // No record
    if (!verifyRow) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === "development"
          ? "Code was not sent"
          : "Code is invalid or expired"
      );
    }

    // Not matching email
    if (verifyRow.user?.email !== user.email) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === "development"
          ? "Email does not match"
          : "Code is invalid or expired"
      );
    }

    // Expired
    if (!isWithinExpirationDate(verifyRow.expiresAt)) {
      // Delete the verification row
      await db
        .delete(tokenTable)
        .where(
          and(
            eq(tokenTable.id, verifyRow.id),
            eq(tokenTable.type, "VERIFY_EMAIL")
          )
        );

      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === "development"
          ? "Code is expired"
          : "Code is invalid or expired"
      );
    }

    // Not matching code
    if (verifyRow.code !== code) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === "development"
          ? "Code does not match"
          : "Code is invalid or expired"
      );
    }

    // Delete the verification row
    await db
      .delete(tokenTable)
      .where(
        and(
          eq(tokenTable.id, verifyRow.id),
          eq(tokenTable.type, "VERIFY_EMAIL")
        )
      );

    // Mathcing code
    // Update session
    await lucia.invalidateUserSessions(user.id);
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, user.id));
    const session = await lucia.createSession(user.id, { email: user.email });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Redirect to home
    return redirect("/");
  });
