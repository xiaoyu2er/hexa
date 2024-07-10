"use server";

import { EmailModal, TokenModel, db, userTable } from "@/lib/db";
import {
  SignupSchema,
  OTPSchema,
  OnlyEmailSchema,
  OnlyTokenSchema,
} from "@/lib/zod/schemas/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  createServerAction,
  inferServerActionInput,
  inferServerActionReturnData,
  inferServerActionReturnType,
  inferServerActionReturnTypeHot,
  ZSAError,
} from "zsa";
import {
  createUser,
  getEmail,
  getUserEmail,
  updateUserEmailVerified,
  updateUserPassword,
} from "@/lib/db/data-access/user";
import { getHash } from "@/lib/utils";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { turnstileProcedure } from "./turnstile";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
import { PUBLIC_URL } from "@/lib/const";
import {
  addDBToken,
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/lib/db/data-access/token";
import { User } from "lucia";
import { getUserEmailProcedure } from "./procedures";

export async function updateTokenAndSendVerifyEmail(
  uid: string,
  email: string
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
    uid,
    email,
    "VERIFY_EMAIL"
  );
  const url = `${PUBLIC_URL}/sign-up/verify-email?token=${token}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return data;
}

export const signupAction = turnstileProcedure
  .createServerAction()
  .input(SignupSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const emailItem = await getEmail(email);

    if (emailItem && emailItem.verified) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "[dev]Email already exists"
          : "Email already exists"
      );
    }

    let user = emailItem?.user;

    if (user) {
      const hashedPassword = await getHash(password);
      if (hashedPassword !== user?.password) {
        await updateUserPassword(user.id, hashedPassword);
      }
    } else {
      user = await createUser({
        email,
        verified: false,
        password,
        avatarUrl: null,
      });

      if (!user) {
        throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create user");
      }
    }
    return await updateTokenAndSendVerifyEmail(user.id, email);
  });

export const resendVerifyEmailAction = getUserEmailProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { email } = ctx;

    if (!email) {
      throw new ZSAError("FORBIDDEN", "User not found");
    }

    return await updateTokenAndSendVerifyEmail(email.user.id, email.email);
  });

async function onVerifyEmailSuccess(tokenItem: TokenModel) {
  await updateUserEmailVerified(tokenItem.userId, tokenItem.email);
  await invalidateUserSessions(tokenItem.userId);
  await setSession(tokenItem.userId);
  redirect("/settings");
}

export const singUpVerifyEmailByCodeAction = createServerAction()
  .input(OTPSchema)
  .handler(async ({ input }) => {
    const { code, email } = input;
    const user = await getUserEmail(email);

    if (!user) {
      throw new ZSAError("FORBIDDEN", "User not found");
    }

    const tokenItem = await verifyDBTokenByCode(
      { id: user.id },
      { code },
      "VERIFY_EMAIL",
      true
    );

    await onVerifyEmailSuccess(tokenItem);
  });

export type VerifyEmailByCodeActionInput = inferServerActionInput<
  typeof singUpVerifyEmailByCodeAction
>;

export type VerifyEmailByCodeActionReturnType = inferServerActionReturnTypeHot<
  typeof singUpVerifyEmailByCodeAction
>;

export const verifyEmailByTokenAction = createServerAction()
  .input(OnlyTokenSchema)
  .handler(async ({ input }) => {
    const { token } = input;
    let tokenItem = await getTokenByToken(token, "VERIFY_EMAIL");
    if (!tokenItem) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "[dev]Code is not found"
          : "Code is invalid or expired"
      );
    }

    tokenItem = await verifyDBTokenByCode(
      { id: tokenItem.userId },
      { token },
      "VERIFY_EMAIL",
      true
    );
    await onVerifyEmailSuccess(tokenItem);
  });
