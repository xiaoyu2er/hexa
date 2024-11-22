'use server';
import type {
  AddPasscodeType,
  UpdatePasscodeType,
} from '@/server/schema/passcode';
import { addPasscode, updatePasscode } from '@/server/store/passcode';

import { sendVerifyCodeAndUrlEmail } from '@/lib/emails';
import type { DbType } from '@/lib/route-types';

export async function addPasscodeAndSendEmail(
  db: DbType,
  {
    userId,
    tmpUserId,
    email,
    type,
    verifyUrlPrefex,
  }: AddPasscodeType & { verifyUrlPrefex: string }
) {
  const {
    code: verificationCode,
    token,
    expiresAt,
    id,
  } = await addPasscode(db, {
    userId,
    tmpUserId,
    email,
    type,
  });

  const url = `${verifyUrlPrefex}${token}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return { id, expiresAt, ...data };
}

export async function resendPasscodeAndSendEmail(
  db: DbType,
  { id, verifyUrlPrefex }: UpdatePasscodeType & { verifyUrlPrefex: string }
) {
  const {
    code: verificationCode,
    token,
    expiresAt,
    email,
  } = await updatePasscode(db, { id });
  const url = `${verifyUrlPrefex}/${token}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return { expiresAt, ...data };
}
