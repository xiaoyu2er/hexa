import { IS_DEVELOPMENT } from '@hexa/env';
import { getHash } from '@hexa/lib';
import { ApiError } from '@hexa/lib';
import type { DbType } from '@hexa/server/route/route-types';
import type { InsertEmailType } from '@hexa/server/schema/email';
import type { InsertUserType } from '@hexa/server/schema/user';
import { emailTable } from '@hexa/server/table/email';
import { userTable } from '@hexa/server/table/user';
import { and, eq, ne } from 'drizzle-orm';
import { pick } from 'lodash';

export async function getUser(db: DbType, uid: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, uid),
  });
  if (!user) {
    throw new ApiError('NOT_FOUND', 'User not found');
  }
  return user;
}

export async function getUserForClient(db: DbType, uid: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, uid),
    with: {
      emails: {
        where: eq(emailTable.primary, true),
        limit: 1,
      },
    },
  });
  if (!user) {
    throw new ApiError('NOT_FOUND', 'User not found');
  }

  return {
    ...pick(user, ['id', 'name', 'avatarUrl']),
    hasPassword: !!user?.password,
    email: user.emails?.[0]?.email,
  };
}

export async function getUserWithProject(db: DbType, uid: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, uid),
    with: {
      defaultProject: true,
    },
  });
  return user;
}

export async function getEmail(db: DbType, email: string) {
  const emailItem = await db.query.emailTable.findFirst({
    where: eq(emailTable.email, email),
    with: {
      user: true,
    },
  });
  return emailItem;
}

export async function getUserEmail(db: DbType, uid: string, email: string) {
  return await db.query.emailTable.findFirst({
    where: and(
      eq(emailTable.userId, uid),
      eq(emailTable.email, email.toLowerCase())
    ),
  });
}

export async function getUserPrimaryEmail(db: DbType, uid: string) {
  return await db.query.emailTable.findFirst({
    where: and(eq(emailTable.userId, uid), eq(emailTable.primary, true)),
  });
}

export async function getUserEmails(db: DbType, uid: string) {
  return await db.query.emailTable.findMany({
    where: eq(emailTable.userId, uid),
  });
}

export const getUserEmailOrThrowError = async (db: DbType, email: string) => {
  const emailItem = await getEmail(db, email);

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

export async function createEmail(
  db: DbType,
  { email, verified, primary, userId }: InsertEmailType
) {
  return (
    await db
      .insert(emailTable)
      .values({
        email,
        verified,
        primary,
        userId,
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
  { password, avatarUrl, name }: InsertUserType
) {
  return (
    await db
      .insert(userTable)
      .values({
        avatarUrl: avatarUrl ?? null,
        name: name ?? null,
        ...(password ? { password } : {}),
      })
      // .onConflictDoNothing()
      .returning()
  )[0];
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
  const emailItem = await getEmail(db, email);

  if (!emailItem) {
    throw new ApiError('NOT_FOUND', 'Email not found');
  }

  if (emailItem.userId !== uid) {
    throw new ApiError('NOT_FOUND', 'Email not found');
  }

  if (emailItem.primary) {
    throw new ApiError('BAD_REQUEST', 'Email is already primary');
  }

  if (!emailItem.verified) {
    throw new ApiError('BAD_REQUEST', 'Email is not verified');
  }

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

export async function updateUsername(db: DbType, uid: string, name: string) {
  await db.update(userTable).set({ name }).where(eq(userTable.id, uid));
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
