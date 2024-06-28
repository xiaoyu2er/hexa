import { generateIdFromEntropySize, Scrypt } from "lucia";
import { createDate } from "oslo";

import { db } from "@/db";
import { tokenTable, TokenType } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { alphabet, generateRandomString } from "oslo/crypto";

import { RESET_PASSWORD_EXPIRE_TIME_SPAN } from "@/lib/const";
import { resend } from "@/lib/emails";
import VerifyCodeTemplate from "@hexa/email-templates/emails/VerifyCode";
import { ZSAError } from "zsa";

export async function getHash(value: string) {
  return new Scrypt().hash(value);
}

export async function isHashValid(hash: string, value: string) {
  return new Scrypt().verify(hash, value);
}

export function generateUserId() {
  return "2088" + generateRandomString(12, alphabet("0-9"));
}

export function generateCode() {
  return generateRandomString(6, alphabet("0-9"));
}
export function generateToken() {
  return generateIdFromEntropySize(25);
}

export async function sendVerificationCodeEmail(email: string, code: string) {
  if (process.env.NODE_ENV === "development") {
    // sleep 1000;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("sending email to", email, "with code");
    return { code, email };
  }

  // @ts-ignore text is not required
  const { data, error } = await resend.emails.send({
    from: "Hexa <noreply@hexa.im>",
    to: [email],
    subject: "Verify your Hexa email address",
    react: VerifyCodeTemplate({ email, code }),
  });

  if (error) {
    console.error("Failed to send email", error);
    throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to send email");
  }

  return data as unknown as { code: string; email: string; url: string };
}

export async function generateDBToken(userId: string, type: TokenType) {
  await db
    .delete(tokenTable)
    .where(and(eq(tokenTable.userId, userId), eq(tokenTable.type, type)));
  const code = generateCode();
  const token = generateToken();
  await db.insert(tokenTable).values({
    code,
    token,
    userId,
    expiresAt: createDate(RESET_PASSWORD_EXPIRE_TIME_SPAN),
    type,
  });
  return { code, token };
}
