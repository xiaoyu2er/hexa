"use server";

import { PUBLIC_URL } from "@/lib/const";
import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
import { addDBToken } from "@/server/data-access/token";
import type { OTPType } from "@/server/db";
import type { DBType } from "@/server/types";

export async function updatePasscodeAndSendEmail(
  db: DBType,
  {
    userId,
    email,
    type,
    publicUrl,
  }: {
    publicUrl: string;
    userId: string;
    email: string;
    type: OTPType;
  },
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
    db,
    userId,
    email,
    type,
  );
  const url = `${publicUrl}/api/verify-token?token=${token}&type=${type}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  console.log("sendVerifyCodeAndUrlEmail", data);
  return data;
}
