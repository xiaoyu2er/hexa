import { generateIdFromEntropySize, Scrypt, User } from "lucia";
import { createDate, isWithinExpirationDate } from "oslo";

import { db } from "@/db";
import { tokenTable, TokenType } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { alphabet, generateRandomString } from "oslo/crypto";

import {
  RESEND_VERIFY_CODE_TIME_SPAN,
  RESET_PASSWORD_EXPIRE_TIME_SPAN,
} from "@/lib/const";
import { resend } from "@/lib/emails";
import VerifyCodeTemplate from "@hexa/email-templates/emails/VerifyCode";
import { ZSAError } from "zsa";
import { formatDistanceStrict } from "date-fns";

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

  return data as unknown as { code: string; email: string };
}

export async function addDBToken(userId: string, type: TokenType) {
  await db
    .delete(tokenTable)
    .where(and(eq(tokenTable.userId, userId), eq(tokenTable.type, type)));
  const code = generateCode();
  const token = generateToken();
  const row = (
    await db
      .insert(tokenTable)
      .values({
        code,
        token,
        userId,
        expiresAt: createDate(RESET_PASSWORD_EXPIRE_TIME_SPAN),
        type,
      })
      .returning()
  )[0];

  if (!row) {
    throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create token");
  }
  return row;
}

export async function findDBToken(userId: string, type: TokenType) {
  return db.query.tokenTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.userId, userId), eq(table.type, type)),
  });
}

export async function sendVerifyTokenEmail(user: User, type: TokenType) {
  if (!user.email) {
    throw new ZSAError("INTERNAL_SERVER_ERROR", "User email is missing");
  }
  const { code: verificationCode } = await addDBToken(user.id, type);

  return await sendVerificationCodeEmail(user.email, verificationCode);
}

export async function resendVerifyTokenEmail(user: User, type: TokenType) {
  if (!user.email) {
    throw new ZSAError("INTERNAL_SERVER_ERROR", "User email is missing");
  }
  const tokenRow = await findDBToken(user.id, type);

  if (tokenRow) {
    const nextSendTime = new Date(
      +tokenRow.createdAt + RESEND_VERIFY_CODE_TIME_SPAN.milliseconds(),
    );

    if (isWithinExpirationDate(nextSendTime)) {
      throw new ZSAError(
        "CONFLICT",
        `Please wait ${formatDistanceStrict(new Date(), nextSendTime)} before resending`,
      );
    }
  }

  const { code } = await addDBToken(user.id, "VERIFY_EMAIL");

  return await sendVerificationCodeEmail(user.email, code);
}
