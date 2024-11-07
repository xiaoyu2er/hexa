"use server";

import { invalidateUserSessions, setSession } from "@/lib/session";
import { getHash, isHashValid } from "@/lib/utils";
import {
  LoginPasscodeSchema,
  LoginPasswordSchema,
  OTPSchema,
  OnlyTokenSchema,
} from "@/lib/zod/schemas/auth";
import { getDB } from "@/server/db";
import {
  addDBToken,
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/server/db/data-access/token";
import { getUserByUsername, getUserEmail } from "@/server/db/data-access/user";
import { redirect } from "next/navigation";
import { ZSAError, chainServerActionProcedures, createServerAction } from "zsa";
import { PUBLIC_URL } from "../const";
import { sendVerifyCodeAndUrlEmail } from "../emails";
import { getUserEmailProcedure } from "./procedures";
import { turnstileProcedure } from "./turnstile";

async function updateTokenAndSendVerifyEmail(
  userId: string,
  email: string,
): Promise<{ email: string }> {
  const db = await getDB();
  const { code: verificationCode, token } = await addDBToken(
    db,
    userId,
    email,
    "LOGIN_PASSCODE",
  );
  const url = `${PUBLIC_URL}/login/passtoken?token=${token}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  console.log("sendVerifyCodeAndUrlEmail", data);
  return data;
}

export const loginPasscodeAction = chainServerActionProcedures(
  turnstileProcedure,
  getUserEmailProcedure,
)
  .createServerAction()
  .input(LoginPasscodeSchema)
  .handler(async ({ ctx }) => {
    const {
      email: {
        email,
        user: { id: userId },
      },
    } = ctx;

    return await updateTokenAndSendVerifyEmail(userId, email);
  });

export const resendLoginPasscodeAction = getUserEmailProcedure
  .createServerAction()
  .input(LoginPasscodeSchema.pick({ email: true }))
  .handler(async ({ ctx }) => {
    const {
      email: {
        email,
        user: { id: userId },
      },
    } = ctx;

    return await updateTokenAndSendVerifyEmail(userId, email);
  });

export const loginByCodeAction = getUserEmailProcedure
  .createServerAction()
  .input(OTPSchema)
  .handler(async ({ input, ctx }) => {
    const { code } = input;
    const {
      email: {
        user: { id: userId },
      },
    } = ctx;
    const db = await getDB();
    const tokenItem = await verifyDBTokenByCode(
      db,
      userId,
      { code },
      "LOGIN_PASSCODE",
      true,
    );

    await invalidateUserSessions(tokenItem.userId);
    await setSession(tokenItem.userId);
    redirect("/settings");
  });

export const loginByTokenAction = createServerAction()
  .input(OnlyTokenSchema)
  .handler(async ({ input }) => {
    const { token } = input;
    const db = await getDB();
    let tokenItem = await getTokenByToken(db, token, "LOGIN_PASSCODE");
    if (!tokenItem) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "[dev]Code is not found"
          : "Code is invalid or expired",
      );
    }
    tokenItem = await verifyDBTokenByCode(
      db,
      tokenItem.userId,
      { token },
      tokenItem.type,
      true,
    );

    await invalidateUserSessions(tokenItem.userId);
    await setSession(tokenItem.userId);
    redirect("/settings");
  });
