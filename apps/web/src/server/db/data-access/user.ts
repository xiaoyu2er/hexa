import { getHash } from "@/lib/utils";
import { getDB } from "@/server/db";
import {
  type EmailModal,
  type UserModel,
  emailTable,
  userTable,
} from "@/server/db/schema";
import type { DBType } from "@/server/types";
import { and, eq, ne } from "drizzle-orm";

export async function getUser(db: DBType, uid: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, uid),
  });

  return user;
}

export async function getUserByUsername(db: DBType, username: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  return user;
}

export async function getEmail(db: DBType, email: string) {
  const emailItem = await db.query.emailTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    with: {
      user: true,
    },
  });

  return emailItem;
}

export async function getUserPrimaryEmail(db: DBType, uid: string) {
  return await db.query.emailTable.findFirst({
    where: (table, { eq }) =>
      and(eq(table.userId, uid), eq(table.primary, true)),
  });
}

export async function getUserEmails(db: DBType, uid: string) {
  return await db.query.emailTable.findMany({
    where: (table, { eq }) => eq(table.userId, uid),
  });
}

export async function getUserEmail(db: DBType, email: string) {
  const emailItem = await db.query.emailTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    with: {
      user: true,
    },
  });
  return emailItem;
}

export async function createUserEmail(
  db: DBType,
  {
    email,
    verified,
    primary,
    userId,
  }: Pick<EmailModal, "email" | "verified" | "primary"> & {
    userId: UserModel["id"];
  },
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

export async function removeUserEmail(db: DBType, uid: string, email: string) {
  await db
    .delete(emailTable)
    .where(and(eq(emailTable.email, email), eq(emailTable.userId, uid)));
}

export async function createUser(
  db: DBType,
  {
    email,
    verified,
    password,
    username,
    avatarUrl,
    name,
  }: Pick<UserModel, "password" | "username" | "avatarUrl" | "name"> &
    Pick<EmailModal, "email" | "verified">,
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

  if (!user) return;

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
  db: DBType,
  uid: string,
  password: string,
) {
  await db
    .update(userTable)
    .set({ password: await getHash(password) })
    .where(eq(userTable.id, uid))
    .returning();
}

export async function updateUserPrimaryEmail(
  db: DBType,
  uid: string,
  email: string,
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
  db: DBType,
  uid: string,
  email: string,
) {
  console.log("updateUserEmailVerified", uid, email);
  await db
    .update(emailTable)
    .set({ verified: true })
    .where(and(eq(emailTable.email, email), eq(emailTable.userId, uid)));
}

export async function updateUserProfile(
  db: DBType,
  uid: string,
  imageUrl: string,
) {
  await db
    .update(userTable)
    .set({ avatarUrl: imageUrl })
    .where(eq(userTable.id, uid));
}

export async function updateProfileName(db: DBType, uid: string, name: string) {
  await db
    .update(userTable)
    // we set name to null if it's an empty string
    .set({ name: name || null })
    .where(eq(userTable.id, uid));
}

export async function updateUsername(
  db: DBType,
  uid: string,
  username: string,
) {
  await db.update(userTable).set({ username }).where(eq(userTable.id, uid));
}

export async function updateUserAvatar(
  db: DBType,
  uid: string,
  avatarUrl: string,
) {
  await db.update(userTable).set({ avatarUrl }).where(eq(userTable.id, uid));
}

export async function deleteUser(db: DBType, uid: string) {
  await db.delete(userTable).where(eq(userTable.id, uid));
}
