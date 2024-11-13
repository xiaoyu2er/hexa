'use server';
import { sendVerifyCodeAndUrlEmail } from '@/lib/emails';
import { addDBToken } from '@/server/data-access/token';
import type { OtpType } from '@/server/db';
import type { DbType } from '@/server/types';

export async function updatePasscodeAndSendEmail(
  db: DbType,
  {
    userId,
    email,
    type,
    publicUrl,
  }: {
    publicUrl: string;
    userId: string;
    email: string;
    type: OtpType;
  }
): Promise<{ email: string }> {
  const { code: verificationCode, token } = await addDBToken(
    db,
    userId,
    email,
    type
  );
  const url = `${publicUrl}/api/verify-token?token=${token}&type=${type}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return data;
}
