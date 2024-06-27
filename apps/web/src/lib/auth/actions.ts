"use server";

import { cookies } from "next/headers";
import { Scrypt } from "lucia";
import { createDate, isWithinExpirationDate } from "oslo";
import { formatDistanceStrict } from "date-fns";

import { generateRandomString, alphabet } from "oslo/crypto";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { db } from "@/db";
import {
  LoginSchema,
  SignupSchema,
  OTPSchema
} from "@/lib/zod/schemas/auth";
import { emailVerificationTable, userTable } from "@/db/schema";

import { createServerAction, ZSAError } from "zsa";
import { redirect } from "next/navigation";
import { EXIPRE_TIME_SPAN, PUBLIC_URL, RESEND_VERIFICATION_CODE_MILLSECONDS } from "@/lib/const";
import { validateRequest } from "./validate-request";
import { z } from "zod";
import { resend } from "@/lib/emails";
import VerifyEmailTemplate from "@hexa/email-templates/emails/VerifyEmail";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
}

export const login = createServerAction()
  .input(LoginSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const existingUser = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (!existingUser || !existingUser?.hashedPassword) {
      throw new ZSAError(
        "FORBIDDEN",
        "Incorrect email or password",
      )
    }
    const validPassword = await new Scrypt().verify(existingUser.hashedPassword, password);
    if (!validPassword) {
      throw new ZSAError(
        "FORBIDDEN",
        "Incorrect email or password",
      )
    }

    const session = await lucia.createSession(existingUser.id, { email: existingUser.email });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    redirect('/');
  });

export const signup = createServerAction()
  .input(SignupSchema)
  .handler(async ({ input }) => {

    const { email, password } = input;
    const existingUser = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
      columns: { email: true },
    });

    if (existingUser) {
      throw new ZSAError(
        "FORBIDDEN",
        "User already exists",
      )
    }

    const userId = generateId();
    const hashedPassword = await getHasedPassword(password);

    const [user] = await db.insert(userTable).values({
      id: userId,
      email,
      hashedPassword,
    }).returning();

    if (!user) {
      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create user"
      )
    }
    console.log('created a new user', user);
    const verificationCode = await generateEmailVerificationCode(userId, email);
    await sendVerificationEmail(email, verificationCode);

    const session = await lucia.createSession(userId, { email: user.email });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    redirect('/verify-email')
  });


export const verifyEmailByCode = createServerAction()
  .input(OTPSchema)
  .handler(async ({ input }) => {
    const { code } = input;
    const { user } = await validateRequest();

    // No session
    if (!user) {
      throw new ZSAError(
        "FORBIDDEN",
        "Access to this verify email is forbidden"
      )
    }

    const verifyRow = await db.query.emailVerificationTable.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
    });

    // No record
    if (!verifyRow) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === 'development' ?
          "Code was not sent" :
          "Code is invalid or expired"
      )
    }

    // Not matching email
    if (verifyRow.email !== user.email) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === 'development' ?
          "Email does not match" :
          "Code is invalid or expired"
      )
    }

    // Expired
    if (!isWithinExpirationDate(verifyRow.expiresAt)) {
      // Delete the verification row
      await db.delete(emailVerificationTable).where(eq(emailVerificationTable.id, verifyRow.id));

      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === 'development' ?
          "Code is expired" :
          "Code is invalid or expired"
      )
    };

    // Not matching code
    if (verifyRow.code !== code) {
      throw new ZSAError(
        "CONFLICT",
        process.env.NODE_ENV === 'development' ?
          "Code does not match" :
          "Code is invalid or expired"
      )
    }

    // Delete the verification row
    await db.delete(emailVerificationTable).where(eq(emailVerificationTable.id, verifyRow.id));

    // Mathcing code
    // Update session
    await lucia.invalidateUserSessions(user.id);
    await db.update(userTable).set({ emailVerified: true }).where(eq(userTable.id, user.id));
    const session = await lucia.createSession(user.id, { email: user.email });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Redirect to home
    return redirect('/');
  });


export const resendVerificationEmail = createServerAction()
  .input(z.object({}))
  .handler(async () => {
    const { user } = await validateRequest();
    if (!user?.email) {
      return redirect('/login');
    }

    const verifyRow = await db.query.emailVerificationTable.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
    });

    if (verifyRow) {
      const nextSendTime = new Date(+verifyRow.createdAt + RESEND_VERIFICATION_CODE_MILLSECONDS);

      if (isWithinExpirationDate(nextSendTime)) {
        throw new ZSAError(
          "CONFLICT",
          `Please wait ${formatDistanceStrict(new Date(), nextSendTime)} before resending`
        )
      }
    }

    const verificationCode = await generateEmailVerificationCode(user.id, user.email);

    await sendVerificationEmail(user.email, verificationCode);
  })

export const logout = createServerAction()
  .input(z.object({}))
  .handler(async () => {
    const { session } = await validateRequest();
    if (!session) {
      throw new ZSAError(
        "FORBIDDEN",
        "User is not authenticated"
      )
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
  });

/**
 * Generate a new email verification code and store it in the database
 * @param userId 
 * @param email 
 * @returns verification code
 */
async function generateEmailVerificationCode(userId: string, email: string) {
  await db.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));
  const code = generateRandomString(6, alphabet("0-9")); // 8 digit code
  await db.insert(emailVerificationTable).values({
    userId,
    email,
    code,
    expiresAt: createDate(EXIPRE_TIME_SPAN)
  });
  return code;
}


async function getHasedPassword(password: string) {
  return new Scrypt().hash(password);
}

function generateId() {
  return '2088' + generateRandomString(12, alphabet("0-9"));
}

async function sendVerificationEmail(email: string, code: string) {
  console.log('sending email to', email, 'with code', code);
  const url = PUBLIC_URL + '/api/verify-email?code=' + code;
  // @ts-ignore text is not required
  const { data, error } = await resend.emails.send({
    from: 'Hexa <noreply@hexa.im>',
    to: [email],
    subject: 'Verify your Hexa email address',
    react: VerifyEmailTemplate({ email, code, url }),
  });

  if (error) {
    console.error('Failed to send email', error);
    throw new ZSAError(
      "INTERNAL_SERVER_ERROR",
      "Failed to send email"
    )
  }

  return data;
}