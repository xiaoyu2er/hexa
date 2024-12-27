import { RESET_PASSWORD_EXPIRE_TIME_SPAN } from '@hexa/const';
import { generateCode, generateId } from '@hexa/lib';
import { ApiError } from '@hexa/lib';
import type { DbType } from '@hexa/server/route/route-types';
import type {
  AddPasscodeType,
  QueryPasscodeByTokenType,
  UpdatePasscodeType,
  VerifyTokenType,
} from '@hexa/server/schema/passcode';
import { passcodeTable } from '@hexa/server/table/passcode';
import { and, eq } from 'drizzle-orm';
// @ts-ignore
import { createDate, isWithinExpirationDate } from 'oslo';

export function deletePasscode(db: DbType, id: string) {
  return db.delete(passcodeTable).where(eq(passcodeTable.id, id));
}

export function findPasscode(db: DbType, id: string) {
  return db.query.passcodeTable.findFirst({
    where: eq(passcodeTable.id, id),
    with: {
      user: true,
      tmpUser: {
        with: {
          oauthAccount: true,
        },
      },
    },
  });
}

export async function addPasscode(
  db: DbType,
  { userId, tmpUserId, email, type }: AddPasscodeType
) {
  const code = generateCode();
  const token = generateId();
  const values = {
    code,
    token,
    userId,
    tmpUserId,
    email,
    expiresAt: createDate(RESET_PASSWORD_EXPIRE_TIME_SPAN),
    type,
  };
  const row = (
    await db
      .insert(passcodeTable)
      .values(values)
      .onConflictDoUpdate({
        target: [passcodeTable.email, passcodeTable.type],
        set: {
          code,
          expiresAt: createDate(RESET_PASSWORD_EXPIRE_TIME_SPAN),
        },
      })
      .returning()
  )[0];

  if (!row) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create token');
  }

  return row;
}

export async function updatePasscode(db: DbType, { id }: UpdatePasscodeType) {
  const code = generateCode();
  const token = generateId();
  const newValues = {
    code,
    token,
    expiresAt: createDate(RESET_PASSWORD_EXPIRE_TIME_SPAN),
  };
  const newRow = (
    await db
      .update(passcodeTable)
      .set(newValues)
      .where(eq(passcodeTable.id, id))
      .returning()
  )[0];

  if (!newRow) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to resend passcode');
  }
  return newRow;
}

export function findPasscodeByToken(
  db: DbType,
  { token, type }: QueryPasscodeByTokenType
) {
  return db.query.passcodeTable.findFirst({
    where: and(eq(passcodeTable.token, token), eq(passcodeTable.type, type)),
    with: {
      user: true,
      tmpUser: {
        with: {
          oauthAccount: true,
        },
      },
    },
  });
}

export async function verifyPasscode(
  db: DbType,
  { code, id, token }: VerifyTokenType
) {
  const passcode = await findPasscode(db, id);

  // No record
  if (!passcode) {
    throw new ApiError('CONFLICT', 'Passcode is invalid or expired');
  }

  // Expired
  if (!isWithinExpirationDate(passcode.expiresAt)) {
    throw new ApiError('CONFLICT', 'Passcode is invalid or expired');
  }

  if (code) {
    // Not matching code
    if (passcode.code !== code) {
      throw new ApiError('CONFLICT', 'Passcode is invalid or expired');
    }
    return passcode;
  }
  if (token) {
    // Not matching token
    if (passcode.token !== token) {
      throw new ApiError('CONFLICT', 'Passcode is invalid or expired');
    }
    return passcode;
  }

  throw new ApiError('CONFLICT', 'Passcode is invalid or expired');
}
