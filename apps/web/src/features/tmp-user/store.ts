import { tokenTable } from '@/features/passcode/table';
import { tmpUserTable } from '@/features/tmp-user/table';
import { ApiError } from '@/lib/error/error';
import { getHash } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import type { DbType } from '../../server/types';

export async function addTmpUser(
  db: DbType,
  {
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }
) {
  // First delete any existing tmp user and tokens
  await db.delete(tokenTable).where(eq(tokenTable.email, email));
  await db.delete(tmpUserTable).where(eq(tmpUserTable.email, email));

  // Create new pending registration
  const newValues = {
    email,
    password: await getHash(password),
    name,
  };
  const row = (await db.insert(tmpUserTable).values(newValues).returning())[0];

  if (!row) {
    throw new ApiError(
      'INTERNAL_SERVER_ERROR',
      'Failed to create registration'
    );
  }

  return row;
}

// Helper function to get pending registration
export async function getTmpUser(db: DbType, tmpUsreId: string) {
  return await db.query.tmpUserTable.findFirst({
    where: (table, { and, eq }) => and(eq(table.id, tmpUsreId)),
  });
}

// Helper function to delete pending registration
export async function deleteTmpUser(db: DbType, token: string) {
  await db.delete(tmpUserTable).where(eq(tmpUserTable.id, token));
}
