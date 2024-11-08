"use server";

import { PUBLIC_URL } from "@/lib/const";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
import { addDBToken } from "@/server/data-access/token";
import { getUserEmail } from "@/server/data-access/user";
import type { OTPType } from "@/server/db";
import type { DBType } from "@/server/types";
import { ZSAError } from "zsa";

export async function updateTokenAndSendPasscode(
  db: DBType,
  userId: string,
  email: string,
  type: OTPType,
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
    db,
    userId,
    email,
    type,
  );
  const url = `${PUBLIC_URL}/api/verify-token?token=${token}&type=${type}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  console.log("sendVerifyCodeAndUrlEmail", data);
  return data;
}

export const getUserEmailOrThrowError = async (db: DBType, email: string) => {
  const emailItem = await getUserEmail(db, email);

  if (!emailItem || !emailItem.user) {
    throw new ZSAError(
      "NOT_FOUND",
      process.env.NODE_ENV === "development"
        ? `[dev] User not found by email: ${email}`
        : "Email not found",
    );
  }
  return emailItem;
};
