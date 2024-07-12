"use server";

import { SignupSchema } from "@/lib/zod/schemas/auth";
import { ZSAError } from "zsa";
import {
  createUser,
  getEmail,
  updateUserPassword,
} from "@/lib/db/data-access/user";
import { getHash } from "@/lib/utils";
import { turnstileProcedure } from "./turnstile";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
import { PUBLIC_URL } from "@/lib/const";
import { addDBToken } from "@/lib/db/data-access/token";
import { getUserEmailProcedure } from "./procedures";

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
    const { email, password } = input;
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
