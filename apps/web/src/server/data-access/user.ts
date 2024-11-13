import { IS_DEVELOPMENT } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { getHash } from '@/lib/utils';
import {
  type EmailModal,
  type UserModel,
  emailTable,
  userTable,
} from '@/server/db/schema';
import type { DbType } from '@/server/types';
import { and, eq, ne } from 'drizzle-orm';

export async function getUser(db: DbType, uid: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, uid),
  });

  return user;
}

export async function getUserByUsername(db: DbType, username: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  return user;
}

export async function getEmail(db: DbType, email: string) {
  const emailItem = await db.query.emailTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    with: {
      user: true,
    },
  });

  return emailItem;
}

export async function getUserPrimaryEmail(db: DbType, uid: string) {
  return await db.query.emailTable.findFirst({
    where: (table, { eq }) =>
      and(eq(table.userId, uid), eq(table.primary, true)),
  });
}

export async function getUserEmails(db: DbType, uid: string) {
  return await db.query.emailTable.findMany({
    where: (table, { eq }) => eq(table.userId, uid),
  });
}

export async function getUserEmail(db: DbType, email: string) {
  const emailItem = await db.query.emailTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    with: {
      user: true,
    },
  });
  return emailItem;
}

export const getUserEmailOrThrowError = async (db: DbType, email: string) => {
  const emailItem = await getUserEmail(db, email);

  if (!emailItem || !emailItem.user) {
    throw new ApiError(
      'NOT_FOUND',
      IS_DEVELOPMENT
        ? `[dev] User not found by email: ${email}`
        : 'Email not found'
    );
  }
  return emailItem;
};

export async function createUserEmail(
  db: DbType,
  {
    email,
    verified,
    primary,
    userId,
  }: Pick<EmailModal, 'email' | 'verified' | 'primary'> & {
    userId: UserModel['id'];
  }
) {
  return (
    await db
      .insert(emailTable)
      .values({
        email,
        verified,
        primary,
        userId: userId,
      })
      .returning()
  )[0];
}

export async function removeUserEmail(db: DbType, uid: string, email: string) {
  await db
    .delete(emailTable)
    .where(and(eq(emailTable.email, email), eq(emailTable.userId, uid)));
}

export async function createUser(
  db: DbType,
  {
    email,
    verified,
    password,
    username,
    avatarUrl,
    name,
  }: Pick<UserModel, 'password' | 'username' | 'avatarUrl' | 'name'> &
    Pick<EmailModal, 'email' | 'verified'>
) {
  const user = (
    await db
      .insert(userTable)
      .values({
        username,
        avatarUrl: avatarUrl ?? null,
        name: name ?? null,
        ...(password ? { password: await getHash(password) } : {}),
      })
      // .onConflictDoNothing()
      .returning()
  )[0];

  if (!user) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create user');
  }

  await createUserEmail(db, {
    email,
    verified,
    primary: true,
    userId: user.id,
  });

  return await db.query.userTable.findFirst({
    where: (table, { eq }) => eq(table.id, user.id),
    with: {
      emails: true,
    },
  });
}

export async function updateUserPassword(
  db: DbType,
  uid: string,
  password: string
) {
  await db
    .update(userTable)
    .set({ password: await getHash(password) })
    .where(eq(userTable.id, uid))
    .returning();
}

export async function updateUserPrimaryEmail(
  db: DbType,
  uid: string,
  email: string
) {
  await db
    .update(emailTable)
    .set({ primary: true })
    .where(and(eq(emailTable.email, email), eq(emailTable.userId, uid)));

  // set all other emails as not primary
  await db
    .update(emailTable)
    .set({ primary: false })
    .where(and(ne(emailTable.email, email), eq(emailTable.userId, uid)));
}

export async function updateUserEmailVerified(
  db: DbType,
  uid: string,
  email: string
) {
  await db
    .update(emailTable)
    .set({ verified: true })
    .where(and(eq(emailTable.email, email), eq(emailTable.userId, uid)));
}

export async function updateUserProfile(
  db: DbType,
  uid: string,
  imageUrl: string
) {
  await db
    .update(userTable)
    .set({ avatarUrl: imageUrl })
    .where(eq(userTable.id, uid));
}

export async function updateProfileName(db: DbType, uid: string, name: string) {
  await db
    .update(userTable)
    // we set name to null if it's an empty string
    .set({ name: name || null })
    .where(eq(userTable.id, uid));
}

export async function updateUsername(
  db: DbType,
  uid: string,
  username: string
) {
  await db.update(userTable).set({ username }).where(eq(userTable.id, uid));
}

export async function updateUserAvatar(
  db: DbType,
  uid: string,
  avatarUrl: string
) {
  await db.update(userTable).set({ avatarUrl }).where(eq(userTable.id, uid));
}

export async function deleteUser(db: DbType, uid: string) {
  await db.delete(userTable).where(eq(userTable.id, uid));
}
