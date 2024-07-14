import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { EmailModal, UserModel, emailTable, userTable } from "@/lib/db/schema";
import { getHash } from "@/lib/utils";

export async function getUser(uid: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, uid),
  });

  return user;
}

export async function getEmail(email: string) {
  const emailItem = await db.query.emailTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    with: {
      user: true,
    },
  });

  return emailItem;
}

export async function getUserPrimaryEmail(uid: string) {
  return await db.query.emailTable.findFirst({
    where: (table, { eq }) =>
      and(eq(table.userId, uid), eq(table.primary, true)),
  });
}

export async function getUserEmails(uid: string) {
  return await db.query.emailTable.findMany({
    where: (table, { eq }) => eq(table.userId, uid),
    orderBy: emailTable.createdAt,
  });
}

export async function getUserEmail(email: string) {
  const emailItem = await db.query.emailTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    with: {
      user: true,
    },
  });
  return emailItem;
}

export async function createUserEmail({
  email,
  verified,
  primary,
  userId,
}: Pick<EmailModal, "email" | "verified" | "primary"> & {
  userId: UserModel["id"];
}) {
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

export async function removeUserEmail(uid: string, email: string) {
  await db
    .delete(emailTable)
    .where(and(eq(emailTable.email, email), eq(emailTable.userId, uid)));
}

export async function createUser({
  email,
  verified,
  password,
  username,
  avatarUrl,
  name,
}: Omit<Partial<UserModel>, "password"> & { password?: string } & Pick<
    EmailModal,
    "email" | "verified"
  >) {
  const user = (
    await db
      .insert(userTable)
      .values({
        username,
        avatarUrl: avatarUrl ?? null,
        name: name ?? null,
        ...(password ? { password: await getHash(password) } : {}),
      })
      .returning()
  )[0];

  if (!user) return;

  await createUserEmail({
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

export async function updateUserPassword(uid: string, password: string) {
  await db
    .update(userTable)
    .set({ password: await getHash(password) })
    .where(eq(userTable.id, uid))
    .returning();
}

export async function updateUserPrimaryEmail(uid: string, email: string) {
  // set email as primary
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

export async function updateUserEmailVerified(uid: string, email: string) {
  await db
    .update(emailTable)
    .set({ verified: true })
    .where(and(eq(emailTable.email, email), eq(emailTable.userId, uid)));
}

export async function updateUserProfile(uid: string, imageUrl: string) {
  await db
    .update(userTable)
    .set({ avatarUrl: imageUrl })
    .where(eq(userTable.id, uid));
}

export async function updateProfileName(uid: string, name: string) {
  await db
    .update(userTable)
    // we set name to null if it's an empty string
    .set({ name: name || null })
    .where(eq(userTable.id, uid));
}

export async function updateUsername(uid: string, username: string) {
  await db.update(userTable).set({ username }).where(eq(userTable.id, uid));
}

export async function updateUserAvatar(uid: string, avatarUrl: string) {
  await db.update(userTable).set({ avatarUrl }).where(eq(userTable.id, uid));
}

export async function deleteUser(uid: string) {
  await db.delete(userTable).where(eq(userTable.id, uid));
}
