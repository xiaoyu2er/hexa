"use server";

import { db, userTable } from "@/lib/db";
import {
  ForgetPasswordSchema,
  ResetPasswordSchema,
  VerifyResetPasswordCodeSchema,
} from "@/lib/zod/schemas/auth";
import { eq } from "drizzle-orm";
import { chainServerActionProcedures } from "zsa";
import {
  addDBToken,
  sendVerificationCodeEmail,
  resendVerifyTokenEmail,
  verifyDBTokenByCode,
} from "./utils";
import { redirect } from "next/navigation";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { getHash } from "@/lib/utils";
import { turnstileProcedure } from "./turnstile";
import { getUserByEmailProcedure } from "./user";

export const forgetPasswordAction = chainServerActionProcedures(
  turnstileProcedure,
  getUserByEmailProcedure,
)
  .createServerAction()
  .input(ForgetPasswordSchema)
  .handler(async ({ input, ctx }) => {
    const { email } = input;
    const user = ctx.user;

    const { code } = await addDBToken(user.id, "RESET_PASSWORD");

    await sendVerificationCodeEmail(email, code);

    return { email };
  });

export const resendResetPasswordCodeAction = getUserByEmailProcedure
  .createServerAction()
  .input(VerifyResetPasswordCodeSchema.pick({ email: true }))
  .handler(async ({ input, ctx }) => {
    const { email } = input;
    const user = ctx.user;
    return resendVerifyTokenEmail({ id: user.id, email }, "RESET_PASSWORD");
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

export const resetPasswordAction = getUserByEmailProcedure
  .createServerAction()
  .input(ResetPasswordSchema)
  .handler(async ({ input, ctx }) => {
    const { token, password } = input;
    const user = ctx.user;

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
