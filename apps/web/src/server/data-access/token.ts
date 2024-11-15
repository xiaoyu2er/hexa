import { RESET_PASSWORD_EXPIRE_TIME_SPAN } from '@/lib/const';
import { IS_DEVELOPMENT } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { generateCode, generateId } from '@/lib/utils';
import { type OtpType, tokenTable } from '@/server/db/schema';
import type { DbType } from '@/server/types';
import { and, eq } from 'drizzle-orm';
import { createDate, isWithinExpirationDate } from 'oslo';

export async function deleteDBToken(db: DbType, userId: string, type: OtpType) {
  return db
    .delete(tokenTable)
    .where(and(eq(tokenTable.userId, userId), eq(tokenTable.type, type)));
}

export async function findDBTokenByUserId(
  db: DbType,
  userId: string,
  type: OtpType
) {
  return db.query.tokenTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.userId, userId), eq(table.type, type)),
  });
}

export async function addDBToken(
  db: DbType,
  userId: string,
  email: string,
  type: OtpType
) {
  await db
    .delete(tokenTable)
    .where(and(eq(tokenTable.userId, userId), eq(tokenTable.type, type)));
  const code = generateCode();
  const token = generateId();
  const row = (
    await db
      .insert(tokenTable)
      .values({
        code,
        token,
        userId,
        email,
        expiresAt: createDate(RESET_PASSWORD_EXPIRE_TIME_SPAN),
        type,
      })
      .returning()
  )[0];

  if (!row) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create token');
  }
  return row;
}

export async function getTokenByToken(
  db: DbType,
  token: string,
  type: OtpType
) {
  return db.query.tokenTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.token, token), eq(table.type, type)),
  });
}

export async function verifyDBTokenByCode(
  db: DbType,
  {
    userId,
    code,
    token,
    type,
    deleteRow = true,
  }: {
    userId: string;
    code?: string;
    token?: string;
    type: OtpType;
    deleteRow?: boolean;
  }
) {
  if (!code && !token) {
    throw new ApiError('CONFLICT', 'Code or token is required');
  }
  const tokenRow = await findDBTokenByUserId(db, userId, type);

  // No record
  if (!tokenRow) {
    throw new ApiError(
      'CONFLICT',
      IS_DEVELOPMENT ? '[dev]Code was not sent' : 'Code is invalid or expired'
    );
  }

  // Expired
  if (!isWithinExpirationDate(tokenRow.expiresAt)) {
    // Delete the verification row
    if (deleteRow) {
      await deleteDBToken(db, userId, type);
    }

    throw new ApiError(
      'CONFLICT',
      IS_DEVELOPMENT ? '[dev]Code is expired' : 'Code is invalid or expired'
    );
  }

  if (code) {
    // Not matching code
    if (tokenRow.code !== code) {
      throw new ApiError(
        'CONFLICT',
        IS_DEVELOPMENT
          ? '[dev]Code does not match'
          : 'Code is invalid or expired'
      );
    }
  } else if (token) {
    // Not matching token
    if (tokenRow.token !== token) {
      throw new ApiError(
        'CONFLICT',
        IS_DEVELOPMENT
          ? '[dev]Token does not match'
          : 'Token is invalid or expired'
      );
    }
  }

  if (deleteRow) {
    await deleteDBToken(db, userId, type);
  }

  return tokenRow;
}
