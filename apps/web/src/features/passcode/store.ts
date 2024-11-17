import type {
  FindPasscodeByEmailType,
  FindPasscodeByTokenType,
  VerifyTokenType,
} from '@/features/passcode/schema';
import { passcodeTable } from '@/features/passcode/table';
import { RESET_PASSWORD_EXPIRE_TIME_SPAN } from '@/lib/const';
import { IS_DEVELOPMENT } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { generateCode, generateId } from '@/lib/utils';
import type { DbType } from '@/server/types';
import { and, eq } from 'drizzle-orm';
import { createDate, isWithinExpirationDate } from 'oslo';

export function deleteDBToken(
  db: DbType,
  { email, type }: FindPasscodeByEmailType
) {
  return db
    .delete(passcodeTable)
    .where(and(eq(passcodeTable.email, email), eq(passcodeTable.type, type)));
}

export async function findDBToken(
  db: DbType,
  { email, type }: FindPasscodeByEmailType
) {
  return db.query.passcodeTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.email, email), eq(table.type, type)),
    with: {
      user: true,
      tmpUser: true,
    },
  });
}

export async function addDBToken(
  db: DbType,
  { userId, tmpUserId, email, type }: FindPasscodeByEmailType
) {
  await db
    .delete(passcodeTable)
    .where(and(eq(passcodeTable.email, email), eq(passcodeTable.type, type)))
    .returning();

  const code = generateCode();
  const token = generateId();
  const row = (
    await db
      .insert(passcodeTable)
      .values({
        code,
        token,
        userId,
        tmpUserId,
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
  { token, type }: FindPasscodeByTokenType
) {
  return db.query.passcodeTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.token, token), eq(table.type, type)),
    with: {
      user: true,
      tmpUser: true,
    },
  });
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export async function verifyDBTokenByCode(
  db: DbType,
  {
    code,
    email,
    token,
    type,
    tmpUserId,
    deleteRow = true,
  }: {
    deleteRow?: boolean;
  } & VerifyTokenType
) {
  if (!code && !token) {
    throw new ApiError('CONFLICT', 'Code or token is required');
  }
  const tokenRow = await findDBToken(db, { email, type });

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
      await deleteDBToken(db, { email, type });
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
    await deleteDBToken(db, { email, type });
  }

  return tokenRow;
}
