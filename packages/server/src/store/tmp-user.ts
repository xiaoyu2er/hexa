import { getHash } from '@hexa/lib';
import { ApiError } from '@hexa/lib';
import type { InsertTmpUser } from '@hexa/server/schema/tmp-user';
import { tmpUserTable } from '@hexa/server/table/tmp-user';
import { eq } from 'drizzle-orm';
import type { DbType } from '../route/route-types';

export async function addTmpUser(
  db: DbType,
  { email, password, oauthAccountId }: InsertTmpUser
) {
  // First delete any existing tmp user and tokens
  // await db.delete(passcodeTable).where(eq(passcodeTable.email, email));
  // await db.delete(tmpUserTable).where(eq(tmpUserTable.email, email));

  // Create new pending registration
  const newValues = {
    email: email.toLowerCase(),
    password: password ? await getHash(password) : null,
    oauthAccountId,
  };
  const row = (
    await db
      .insert(tmpUserTable)
      .values(newValues)
      .onConflictDoUpdate({
        target: [tmpUserTable.email],
        set: {
          // id: generateId('tmpu'), // update the tmpUserId too
          ...newValues,
        },
      })
      .returning()
  )[0];

  if (!row) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create user');
  }

  return row;
}

// Helper function to get pending registration
export async function getTmpUser(db: DbType, tmpUserId: string) {
  return await db.query.tmpUserTable.findFirst({
    where: eq(tmpUserTable.id, tmpUserId),
  });
}

// Helper function to delete pending registration
export async function deleteTmpUser(db: DbType, tmpUserId: string) {
  await db.delete(tmpUserTable).where(eq(tmpUserTable.id, tmpUserId));
}
