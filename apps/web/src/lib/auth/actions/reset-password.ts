"use server";

import { db, userTable } from "@/db";
import {
  ForgetPasswordSchema,
  ResetPasswordSchema,
  VerifyResetPasswordCodeSchema,
} from "@/lib/zod/schemas/auth";
import { eq } from "drizzle-orm";
import { createServerAction, ZSAError } from "zsa";
import {
  addDBToken,
  sendVerificationCodeEmail,
  resendVerifyTokenEmail,
  verifyDBTokenByCode,
} from "./utils";
import { redirect } from "next/navigation";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { getHash } from "@/lib/utils";

export const forgetPasswordAction = createServerAction()
  .input(ForgetPasswordSchema)
  .handler(async ({ input }) => {
    const { email } = input;

    const user = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
    if (!user) {
      throw new ZSAError(
        "NOT_FOUND",
        process.env.NODE_ENV === "development"
          ? "Email not found"
          : "Email not found",
      );
    }

    const { code } = await addDBToken(user.id, "RESET_PASSWORD");

    await sendVerificationCodeEmail(email, code);

    return { email };
  });

export const resendResetPasswordCodeAction = createServerAction()
  .input(ForgetPasswordSchema)
  .handler(async ({ input }) => {
    const { email } = input;

    const user = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
    if (!user) {
      throw new ZSAError(
        "NOT_FOUND",
        process.env.NODE_ENV === "development"
          ? "Email not found"
          : "Email not found",
      );
    }

    return resendVerifyTokenEmail({ id: user.id, email }, "RESET_PASSWORD");
  });

export const verifyResetPasswordCodeAction = createServerAction()
  .input(VerifyResetPasswordCodeSchema)
  .handler(async ({ input }) => {
    const { email, code } = input;
    console.log("verifyResetPasswordCodeAction", email, code);
    const user = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
    if (!user) {
      throw new ZSAError(
        "NOT_FOUND",
        process.env.NODE_ENV === "development"
          ? "Email not found"
          : "Email not found",
      );
    }

    const tokenRow = await verifyDBTokenByCode(
      user,
      { code },
      "RESET_PASSWORD",
      false,
    );
    return { token: tokenRow.token };
  });

export const resetPasswordAction = createServerAction()
  .input(ResetPasswordSchema)
  .handler(async ({ input }) => {
    const { email, token, password } = input;

    const user = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (!user) {
      throw new ZSAError(
        "NOT_FOUND",
        process.env.NODE_ENV === "development"
          ? "Email not found"
          : "Email not found",
      );
    }

    await verifyDBTokenByCode(user, { token }, "RESET_PASSWORD", true);

    // update the password
    const hashedPassword = await getHash(password);
    await db
      .update(userTable)
      .set({ hashedPassword })
      .where(eq(userTable.id, user.id));

    // invalidate all sessions & update a new sssion
    await invalidateUserSessions(user.id);
    await setSession(user.id);

    redirect("/");
  });
