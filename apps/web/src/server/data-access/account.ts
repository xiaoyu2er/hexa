import {
  type InsertOauthAccountType,
  type ProviderType,
  type SelectUserType,
  oauthAccountTable,
} from '@/server/db/schema';
import type { DbType } from '@/server/types';
import type { GitHubUser, GoogleUser } from '@/types';
import { and, eq } from 'drizzle-orm';

export async function getAccountByGoogleId(db: DbType, googleId: string) {
  return await db.query.oauthAccountTable.findFirst({
    where: and(
      eq(oauthAccountTable.provider, 'GOOGLE'),
      eq(oauthAccountTable.providerAccountId, googleId)
    ),
    with: {
      user: true,
    },
  });
}

export async function getAccountByGithubId(db: DbType, githubId: number) {
  return await db.query.oauthAccountTable.findFirst({
    where: and(
      eq(oauthAccountTable.provider, 'GITHUB'),
      eq(oauthAccountTable.providerAccountId, String(githubId))
    ),
    with: {
      user: true,
    },
  });
}

export async function createGithubAccount(
  db: DbType,
  userId: SelectUserType['id'] | null,
  githubUser: GitHubUser
) {
  return (
    await db
      .insert(oauthAccountTable)
      .values({
        userId: userId,
        provider: 'GITHUB',
        providerAccountId: String(githubUser.id),
        avatarUrl: githubUser.avatar_url,
        email: githubUser.email,
        name: githubUser.name,
        username: githubUser.login,
      })
      .onConflictDoUpdate({
        target: [
          oauthAccountTable.provider,
          oauthAccountTable.providerAccountId,
        ],
        set: {
          avatarUrl: githubUser.avatar_url,
          email: githubUser.email,
          name: githubUser.name,
          username: githubUser.login,
        },
      })
      .returning()
  )[0];
}

export async function createGoogleAccount(
  db: DbType,
  userId: SelectUserType['id'] | null,
  googleUser: GoogleUser
) {
  return (
    await db
      .insert(oauthAccountTable)
      .values({
        userId: userId,
        provider: 'GOOGLE',
        providerAccountId: googleUser.sub,
        avatarUrl: googleUser.picture,
        email: googleUser.email,
        name: googleUser.name,
        username: googleUser.email,
      })
      .onConflictDoUpdate({
        target: [
          oauthAccountTable.provider,
          oauthAccountTable.providerAccountId,
        ],
        set: {
          avatarUrl: googleUser.picture,
          email: googleUser.email,
          name: googleUser.name,
          username: googleUser.email,
        },
      })
      .returning()
  )[0];
}

export async function getUserOauthAccounts(
  db: DbType,
  userId: SelectUserType['id']
) {
  return await db.query.oauthAccountTable.findMany({
    where: eq(oauthAccountTable.userId, userId),
  });
}

export async function getOauthAccount(db: DbType, id: string) {
  return await db.query.oauthAccountTable.findFirst({
    where: eq(oauthAccountTable.id, id),
  });
}

export async function updateOauthAccount(
  db: DbType,
  oauthAccountId: string,
  data: Partial<InsertOauthAccountType>
) {
  return (
    await db
      .update(oauthAccountTable)
      .set(data)
      .where(eq(oauthAccountTable.id, oauthAccountId))
      .returning()
  )[0];
}

export async function removeUserOauthAccount(
  db: DbType,
  uid: SelectUserType['id'],
  provider: ProviderType
) {
  return await db
    .delete(oauthAccountTable)
    .where(
      and(
        eq(oauthAccountTable.userId, uid),
        eq(oauthAccountTable.provider, provider)
      )
    );
}
