import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ProviderType, UserModel, oauthAccountTable } from "../schema";
import { GitHubUser, GoogleUser } from "@/types";

export async function getAccountByGoogleId(googleId: string) {
  return await db.query.oauthAccountTable.findFirst({
    where: and(
      eq(oauthAccountTable.provider, "GOOGLE"),
      eq(oauthAccountTable.providerAccountId, googleId)
    ),
  });
}

export async function getAccountByGithubId(githubId: number) {
  return await db.query.oauthAccountTable.findFirst({
    where: and(
      eq(oauthAccountTable.provider, "GITHUB"),
      eq(oauthAccountTable.providerAccountId, String(githubId))
    ),
    with: {
      user: true,
    },
  });
}

export async function createGithubAccount(
  userId: UserModel["id"],
  githubUser: GitHubUser
) {
  return (
    await db
      .insert(oauthAccountTable)
      .values({
        userId: userId,
        provider: "GITHUB",
        providerAccountId: String(githubUser.id),
      })
      .returning()
  )[0];
}

export async function createGoogleAccount(
  userId: UserModel["id"],
  googleUser: GoogleUser
) {
  return (
    await db
      .insert(oauthAccountTable)
      .values({
        userId: userId,
        provider: "GOOGLE",
        providerAccountId: googleUser.sub,
      })
      .returning()
  )[0];
}

export async function getUserOAuthAccounts(userId: UserModel["id"]) {
  return await db.query.oauthAccountTable.findMany({
    where: eq(oauthAccountTable.userId, userId),
  });
}

export async function removeUserOAuthAccount(
  uid: UserModel["id"],
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
