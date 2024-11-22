import type {
  AddPasscodeType,
  QueryPasscodeByTokenType,
  SelectedPasscodeType,
  UpdatePasscodeType,
  VerifyTokenType,
} from '@/features/passcode/schema';
import { passcodeTable } from '@/features/passcode/table';
import { RESET_PASSWORD_EXPIRE_TIME_SPAN } from '@/lib/const';
import { generateCode, generateId } from '@/lib/crypto';
import { ApiError } from '@/lib/error/error';
import type { DbType } from '@/lib/route-types';
import { eq } from 'drizzle-orm';
import { createDate, isWithinExpirationDate } from 'oslo';

export function deletePasscode(db: DbType, id: string) {
  return db.delete(passcodeTable).where(eq(passcodeTable.id, id));
}

export async function findPasscode(
  db: DbType,
  id: string
): Promise<SelectedPasscodeType | undefined> {
  return db.query.passcodeTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
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
      .onConflictDoNothing()
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

export async function findPasscodeByToken(
  db: DbType,
  { token, type }: QueryPasscodeByTokenType
): Promise<SelectedPasscodeType | undefined> {
  return db.query.passcodeTable.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.token, token), eq(table.type, type)),
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
