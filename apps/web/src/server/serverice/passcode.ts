'use server';
import { sendVerifyCodeAndUrlEmail } from '@/lib/emails';
import { addDBToken } from '@/server/data-access/token';
import type { FindTokenByEmailType } from '@/server/db';
import type { DbType } from '@/server/types';

export async function updatePasscodeAndSendEmail(
  db: DbType,
  {
    userId,
    tmpUserId,
    email,
    type,
    publicUrl,
  }: {
    publicUrl: string;
  } & FindTokenByEmailType
): Promise<{ email: string; tmpUserId: string | null | undefined }> {
  const { code: verificationCode, token } = await addDBToken(db, {
    userId,
    tmpUserId,
    email,
    type,
  });

  const url = `${publicUrl}/api/verify-token?token=${token}&type=${type}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return { ...data, tmpUserId };
}
