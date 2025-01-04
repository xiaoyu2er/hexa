'use server';
import { sendVerifyCodeAndUrlEmail } from '@hexa/server/lib';
import type {
  AddPasscodeType,
  UpdatePasscodeType,
} from '@hexa/server/schema/passcode';
import { addPasscode, updatePasscode } from '@hexa/server/store/passcode';
import type { DbType } from '@hexa/server/types';

export async function addPasscodeAndSendEmail(
  db: DbType,
  {
    userId,
    tmpUserId,
    email,
    type,
    verifyUrlPrefex,
    verifyUrlSuffix,
  }: AddPasscodeType & { verifyUrlPrefex: string; verifyUrlSuffix?: string }
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

  const url = `${verifyUrlPrefex}${token}${verifyUrlSuffix ?? ''}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return { id, expiresAt, ...data };
}

export async function resendPasscodeAndSendEmail(
  db: DbType,
  {
    id,
    verifyUrlPrefex,
    verifyUrlSuffix,
  }: UpdatePasscodeType & { verifyUrlPrefex: string; verifyUrlSuffix?: string }
) {
  const {
    code: verificationCode,
    token,
    expiresAt,
    email,
  } = await updatePasscode(db, { id });
  const url = `${verifyUrlPrefex}${token}${verifyUrlSuffix ?? ''}`;
  const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
  return { id, expiresAt, ...data };
}
