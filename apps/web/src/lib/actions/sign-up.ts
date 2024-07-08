"use server";

import { TokenModel, db, userTable } from "@/lib/db";
import {
  SignupSchema,
  OTPSchema,
  OnlyEmailSchema,
  OnlyTokenSchema,
} from "@/lib/zod/schemas/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createServerAction, ZSAError } from "zsa";
import {
  createUser,
  getUserByEmail,
  updateUserEmailVerified,
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

async function updateTokenAndSendVerifyEmail(
  user: User,
): Promise<{ email: string }> {
  if (!user.email) {
    throw new ZSAError("INTERNAL_SERVER_ERROR", "User email is missing");
  }
  const { code: verificationCode, token } = await addDBToken(
    user.id,
    "VERIFY_EMAIL",
  );
  const url = `${PUBLIC_URL}/sign-up/verify-email?token=${token}`;
  const data = await sendVerifyCodeAndUrlEmail(
    user.email,
    verificationCode,
    url,
  );
  return data;
}

export const signupAction = turnstileProcedure
  .createServerAction()
  .input(SignupSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const existingUser = await getUserByEmail(email);

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
      }
    } else {
      user = await createUser({
        email,
        emailVerified: false,
        password,
        avatarUrl: null,
      });
    }

    if (!user) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create user");
    }

    return await updateTokenAndSendVerifyEmail(user);
  });

export const resendVerifyEmailAction = createServerAction()
  .input(OnlyEmailSchema)
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await getUserByEmail(email);
    if (!user) {
      throw new ZSAError("FORBIDDEN", "User not found");
    }

    return await updateTokenAndSendVerifyEmail(user);
  });

async function onVerifyEmailSuccess(tokenItem: TokenModel) {
  await invalidateUserSessions(tokenItem.userId);
  await updateUserEmailVerified(tokenItem.userId);
  await setSession(tokenItem.userId);
  redirect("/settings");
}

export const verifyEmailByCodeAction = createServerAction()
  .input(OTPSchema)
  .handler(async ({ input }) => {
    const { code, email } = input;
    const user = await getUserByEmail(email);

    if (!user) {
      throw new ZSAError("FORBIDDEN", "User not found");
    }

    const tokenItem = await verifyDBTokenByCode(
      { id: user.id },
      { code },
      "VERIFY_EMAIL",
      true,
    );

    await onVerifyEmailSuccess(tokenItem);
  });

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
          : "Code is invalid or expired",
      );
    }

    tokenItem = await verifyDBTokenByCode(
      { id: tokenItem.userId },
      { token },
      "VERIFY_EMAIL",
      true,
    );
    await onVerifyEmailSuccess(tokenItem);
  });
