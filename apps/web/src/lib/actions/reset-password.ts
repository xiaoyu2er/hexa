"use server";

import { PUBLIC_URL } from "@/lib/const";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
import { invalidateUserSessions, setSession } from "@/lib/session";
import {
  ForgetPasswordSchema,
  ResetPasswordSchema,
  VerifyResetPasswordCodeSchema,
} from "@/lib/zod/schemas/auth";
import { getDB } from "@/server/db";
import {
  addDBToken,
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/server/db/data-access/token";
import { updateUserPassword } from "@/server/db/data-access/user";
import type { DBType } from "@/server/types";
import { redirect } from "next/navigation";
import {
  ZSAError,
  chainServerActionProcedures,
  createServerAction,
  type inferServerActionInput,
  type inferServerActionReturnData,
  type inferServerActionReturnTypeHot,
} from "zsa";
import { getUserEmailProcedure } from "./procedures";
import { turnstileProcedure } from "./turnstile";

async function updateTokenAndSendVerifyEmail(
  db: DBType,
  userId: string,
  email: string,
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
    db,
    userId,
    email,
    "RESET_PASSWORD",
  );
  const url = `${PUBLIC_URL}/reset-password?token=${token}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  console.log("sendVerifyCodeAndUrlEmail", data);
  return data;
}

export const forgetPasswordAction = chainServerActionProcedures(
  turnstileProcedure,
  getUserEmailProcedure,
)
  .createServerAction()
  .input(ForgetPasswordSchema)
  .handler(async ({ ctx }) => {
    const {
      email: {
        email,
        user: { id: userId },
      },
    } = ctx;
    const db = await getDB();
    return await updateTokenAndSendVerifyEmail(db, userId, email);
  });

export const resendResetPasswordCodeAction = getUserEmailProcedure
  .createServerAction()
  .input(VerifyResetPasswordCodeSchema.pick({ email: true }))
  .handler(async ({ ctx }) => {
    const {
      email: {
        email,
        user: { id: userId },
      },
    } = ctx;
    const db = await getDB();
    return await updateTokenAndSendVerifyEmail(db, userId, email);
  });

export const verifyResetPasswordCodeAction = getUserEmailProcedure
  .createServerAction()
  .input(VerifyResetPasswordCodeSchema)
  .handler(async ({ input, ctx }) => {
    const { code } = input;
    const {
      email: {
        user: { id: userId },
      },
    } = ctx;
    const db = await getDB();
    const tokenRow = await verifyDBTokenByCode(
      db,
      userId,
      { code },
      "RESET_PASSWORD",
      false,
    );
    return { token: tokenRow.token };
  });

export type VerifyCodeActionInput = inferServerActionInput<
  typeof verifyResetPasswordCodeAction
>;

export type VerifyCodeActionReturnType = inferServerActionReturnTypeHot<
  typeof verifyResetPasswordCodeAction
>;

export type VerifyCodeActionReturnData = inferServerActionReturnData<
  typeof verifyResetPasswordCodeAction
>;

export type ResendCodeActionInput = inferServerActionInput<
  typeof resendResetPasswordCodeAction
>;

export type ResendCodeActionReturnType = inferServerActionReturnTypeHot<
  typeof resendResetPasswordCodeAction
>;

export const resetPasswordAction = createServerAction()
  .input(ResetPasswordSchema)
  .handler(async ({ input }) => {
    const { token, password } = input;
    const db = await getDB();
    const tokenRow = await getTokenByToken(db, token, "RESET_PASSWORD");
    if (!tokenRow) {
      throw new ZSAError("CONFLICT", "Invalid token");
    }
    await verifyDBTokenByCode(
      db,
      tokenRow.userId,
      { token },
      "RESET_PASSWORD",
      true,
    );

    // update the password
    await updateUserPassword(db, tokenRow.userId, password);

    // invalidate all sessions & update a new sssion
    await invalidateUserSessions(tokenRow.userId);
    await setSession(tokenRow.userId);

    redirect("/");
  });
