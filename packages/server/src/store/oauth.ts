import type {
  GitHubUser,
  GoogleUser,
  InsertOauthAccountType,
  ProviderType,
  SelectOauthAccountType,
  SelectOauthAccountWithUserType,
} from '@hexa/server/schema/oauth';
import type { SelectUserType } from '@hexa/server/schema/user';
import { oauthAccountTable } from '@hexa/server/table/oauth';
import type { DbType } from '@hexa/server/types';
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
export async function getAccountById(db: DbType, id: string) {
  return await db.query.oauthAccountTable.findFirst({
    where: eq(oauthAccountTable.id, id),
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

export async function getAccountByProviderUser(
  db: DbType,
  provider: ProviderType,
  providerUser: GitHubUser | GoogleUser
) {
  // Find existing oauthAccount
  let existingAccount: SelectOauthAccountWithUserType | undefined;
  if (provider === 'GITHUB') {
    existingAccount = await getAccountByGithubId(
      db,
      (providerUser as GitHubUser).id
    );
  } else if (provider === 'GOOGLE') {
    existingAccount = await getAccountByGoogleId(
      db,
      (providerUser as GoogleUser).sub
    );
  }
  return existingAccount;
}

export async function createGithubAccount(
  db: DbType,
  userId: string | null,
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
        emailVerified: githubUser.email_verified,
        name: githubUser.name,
        username: githubUser.login,
      })
      .onConflictDoUpdate({
        target: [
          oauthAccountTable.provider,
          oauthAccountTable.providerAccountId,
        ],
        set: {
          userId: userId,
          avatarUrl: githubUser.avatar_url,
          email: githubUser.email,
          emailVerified: githubUser.email_verified,
          name: githubUser.name,
          username: githubUser.login,
        },
      })
      .returning()
  )[0];
}

export async function createGoogleAccount(
  db: DbType,
  userId: string | null,
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
        emailVerified: googleUser.email_verified,
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
          emailVerified: googleUser.email_verified,
          name: googleUser.name,
          username: googleUser.email,
        },
      })
      .returning()
  )[0];
}

export async function createOauthAccount(
  db: DbType,
  userId: string | null,
  provider: ProviderType,
  providerUser: GitHubUser | GoogleUser
) {
  let account: SelectOauthAccountType | undefined;
  if (provider === 'GITHUB') {
    account = await createGithubAccount(db, userId, providerUser as GitHubUser);
  } else if (provider === 'GOOGLE') {
    account = await createGoogleAccount(db, userId, providerUser as GoogleUser);
  }
  return account;
}

export async function getUserOauthAccounts(db: DbType, userId: string) {
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
