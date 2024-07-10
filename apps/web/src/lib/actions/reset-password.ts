"use server";

import { PUBLIC_URL } from "@/lib/const";
import {
  addDBToken,
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/lib/db/data-access/token";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { getHash } from "@/lib/utils";
import {
  ForgetPasswordSchema,
  ResetPasswordSchema,
  VerifyResetPasswordCodeSchema,
} from "@/lib/zod/schemas/auth";
import { redirect } from "next/navigation";
import { ZSAError, chainServerActionProcedures, createServerAction } from "zsa";
import { updateUserPassword } from "@/lib/db/data-access/user";
import { getUserEmailProcedure } from "./procedures";
import { turnstileProcedure } from "./turnstile";

async function updateTokenAndSendVerifyEmail(
  userId: string,
  email: string
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
    userId,
    email,
    "RESET_PASSWORD"
  );
  const url = `${PUBLIC_URL}/reset-password?token=${token}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return data;
}

export const forgetPasswordAction = chainServerActionProcedures(
  turnstileProcedure,
  getUserEmailProcedure
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

    return await updateTokenAndSendVerifyEmail(userId, email);
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

    return await updateTokenAndSendVerifyEmail(userId, email);
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
    const tokenRow = await verifyDBTokenByCode(
      userId,
      { code },
      "RESET_PASSWORD",
      false
    );
    return { token: tokenRow.token };
  });

export const resetPasswordAction = createServerAction()
  .input(ResetPasswordSchema)
  .handler(async ({ input }) => {
    const { token, password } = input;
    const tokenRow = await getTokenByToken(token, "RESET_PASSWORD");
    if (!tokenRow) {
      throw new ZSAError("CONFLICT", "Invalid token");
    }
    await verifyDBTokenByCode(
      tokenRow.userId,
      { token },
      "RESET_PASSWORD",
      true
    );

    // update the password
    await updateUserPassword(tokenRow.userId, await getHash(password));

    // invalidate all sessions & update a new sssion
    await invalidateUserSessions(tokenRow.userId);
    await setSession(tokenRow.userId);

    redirect("/");
  });
