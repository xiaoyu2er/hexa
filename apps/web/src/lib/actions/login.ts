"use server";

import { invalidateUserSessions, setSession } from "@/lib/session";
import { isHashValid } from "@/lib/utils";
import {
  LoginPasscodeSchema,
  LoginPasswordSchema,
  OTPSchema,
  OnlyTokenSchema,
} from "@/lib/zod/schemas/auth";
import { redirect } from "next/navigation";
import { ZSAError, chainServerActionProcedures, createServerAction } from "zsa";
import { PUBLIC_URL } from "../const";
import {
  addDBToken,
  getTokenByToken,
  verifyDBTokenByCode,
} from "../db/data-access/token";
import { getUserEmail } from "../db/data-access/user";
import { sendVerifyCodeAndUrlEmail } from "../emails";
import { getUserEmailProcedure } from "./procedures";
import { turnstileProcedure } from "./turnstile";

export const loginPasswordAction = turnstileProcedure
  .createServerAction()
  .input(LoginPasswordSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const emailItem = await getUserEmail(email);
    const existingUser = emailItem?.user;

    if (!existingUser) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "User does not exist"
          : "Incorrect email or password",
      );
    }

    if (!existingUser.password) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "No password set"
          : "Incorrect email or password",
      );
    }

    const validPassword = await isHashValid(existingUser.password, password);

    if (!validPassword) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "Incorrect password"
          : "Incorrect email or password",
      );
    }

    await setSession(existingUser.id);

    redirect("/");
  });

async function updateTokenAndSendVerifyEmail(
  userId: string,
  email: string,
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
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

    const tokenItem = await verifyDBTokenByCode(
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
    let tokenItem = await getTokenByToken(token, "LOGIN_PASSCODE");
    if (!tokenItem) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "[dev]Code is not found"
          : "Code is invalid or expired",
      );
    }
    tokenItem = await verifyDBTokenByCode(
      tokenItem.userId,
      { token },
      tokenItem.type,
      true,
    );

    await invalidateUserSessions(tokenItem.userId);
    await setSession(tokenItem.userId);
    redirect("/settings");
  });
