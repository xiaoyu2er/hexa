"use server";

import { db, userTable } from "@/lib/db";
import {
  ForgetPasswordSchema,
  ResetPasswordSchema,
  VerifyResetPasswordCodeSchema,
} from "@/lib/zod/schemas/auth";
import { eq } from "drizzle-orm";
import { ZSAError, chainServerActionProcedures, createServerAction } from "zsa";
import { redirect } from "next/navigation";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { getHash } from "@/lib/utils";
import { turnstileProcedure } from "./turnstile";
import { getUserByEmailProcedure } from "./procedures";
import { User } from "lucia";
import { PUBLIC_URL } from "@/lib/const";
import {
  addDBToken,
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/lib/db/data-access/token";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";

async function updateTokenAndSendVerifyEmail(
  user: User,
): Promise<{ email: string }> {
  if (!user.email) {
    throw new ZSAError("INTERNAL_SERVER_ERROR", "User email is missing");
  }
  const { code: verificationCode, token } = await addDBToken(
    user.id,
    "RESET_PASSWORD",
  );
  const url = `${PUBLIC_URL}/reset-password?token=${token}`;
  const data = await sendVerifyCodeAndUrlEmail(
    user.email,
    verificationCode,
    url,
  );
  return data;
}

export const forgetPasswordAction = chainServerActionProcedures(
  turnstileProcedure,
  getUserByEmailProcedure,
)
  .createServerAction()
  .input(ForgetPasswordSchema)
  .handler(async ({ ctx }) => {
    const user = ctx.user;
    return await updateTokenAndSendVerifyEmail(user);
  });

export const resendResetPasswordCodeAction = getUserByEmailProcedure
  .createServerAction()
  .input(VerifyResetPasswordCodeSchema.pick({ email: true }))
  .handler(async ({ ctx }) => {
    const user = ctx.user;
    return await updateTokenAndSendVerifyEmail(user);
  });

export const verifyResetPasswordCodeAction = getUserByEmailProcedure
  .createServerAction()
  .input(VerifyResetPasswordCodeSchema)
  .handler(async ({ input, ctx }) => {
    const { email, code } = input;
    console.log("verifyResetPasswordCodeAction", email, code);
    const user = ctx.user;
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
    const { token, password } = input;
    const tokenRow = await getTokenByToken(token, "RESET_PASSWORD");
    if (!tokenRow) {
      throw new ZSAError("CONFLICT", "Invalid token");
    }
    await verifyDBTokenByCode(
      { id: tokenRow.userId },
      { token },
      "RESET_PASSWORD",
      true,
    );

    // update the password
    const hashedPassword = await getHash(password);
    await db
      .update(userTable)
      .set({ hashedPassword })
      .where(eq(userTable.id, tokenRow.userId));

    // invalidate all sessions & update a new sssion
    await invalidateUserSessions(tokenRow.userId);
    await setSession(tokenRow.userId);

    redirect("/");
  });
