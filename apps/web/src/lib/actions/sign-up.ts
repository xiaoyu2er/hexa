"use server";

import { PUBLIC_URL } from "@/lib/const";
import { addDBToken } from "@/lib/db/data-access/token";
import {
  createUser,
  getEmail,
  getUserEmail,
  updateUserPassword,
} from "@/lib/db/data-access/user";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
import { OAuthSignupSchema, SignupSchema } from "@/lib/zod/schemas/auth";
import { redirect } from "next/navigation";
import {
  ZSAError,
  inferServerActionInput,
  inferServerActionReturnTypeHot,
} from "zsa";
import { getOAuthAccount, updateOAuthAccount } from "../db/data-access/account";
import { invalidateUserSessions, setSession } from "../session";
import { getUserEmailProcedure } from "./procedures";
import { turnstileProcedure } from "./turnstile";

export async function updateTokenAndSendVerifyEmail(
  uid: string,
  email: string,
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
    uid,
    email,
    "VERIFY_EMAIL",
  );
  const url = `${PUBLIC_URL}/verify-email?token=${token}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  console.log("sendVerifyCodeAndUrlEmail", data);
  return data;
}

export const signupAction = turnstileProcedure
  .createServerAction()
  .input(SignupSchema)
  .handler(async ({ input }) => {
    const { email, password, username } = input;
    const emailItem = await getEmail(email);

    if (emailItem && emailItem.verified) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "[dev]Email already exists"
          : "Email already exists",
      );
    }

    let user = emailItem?.user;

    if (user) {
      await updateUserPassword(user.id, password);
    } else {
      user = await createUser({
        name: null,
        email,
        verified: false,
        password,
        username,
        avatarUrl: null,
      });

      if (!user) {
        throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create user");
      }
    }
    return await updateTokenAndSendVerifyEmail(user.id, email);
  });

export const oauthSignupAction = turnstileProcedure
  .createServerAction()
  .input(OAuthSignupSchema)
  .handler(async ({ input }) => {
    const { username, oauthAccountId } = input;
    const oauthAcccount = await getOAuthAccount(oauthAccountId);
    if (!oauthAcccount) {
      throw new ZSAError("FORBIDDEN", "OAuth account not found");
    }

    const emailItem = await getUserEmail(oauthAcccount.email);

    if (emailItem && emailItem.verified) {
      throw new ZSAError("FORBIDDEN", "Email already exists");
    }

    const user = await createUser({
      email: oauthAcccount.email,
      verified: true,
      // we don't need password for oauth signup
      password: null,
      username,
      avatarUrl: oauthAcccount.avatarUrl,
      name: oauthAcccount.name,
    });

    if (!user) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create user");
    }

    await updateOAuthAccount(oauthAcccount.id, { userId: user.id });
    await invalidateUserSessions(user.id);
    await setSession(user.id);
    redirect("/settings");
    // return {};
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

export type ResendCodeActionInput = inferServerActionInput<
  typeof resendVerifyEmailAction
>;

export type ResendCodeActionReturnType = inferServerActionReturnTypeHot<
  typeof resendVerifyEmailAction
>;
