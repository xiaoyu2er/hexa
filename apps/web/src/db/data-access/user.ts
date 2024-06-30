import { eq } from "drizzle-orm";
import { db } from "../db";
import { UserModel, userTable } from "../schema";
import { getHash } from "@/lib/utils";

export async function getUserByEmail(email: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  return user;
}

export async function createUser({
  email,
  emailVerified,
  password,
}: Pick<UserModel, "email" | "emailVerified"> & { password?: string }) {
  const user = (
    await db
      .insert(userTable)
      .values({
        email,
        emailVerified,
        ...(password ? { hashedPassword: await getHash(password) } : {}),
      })
      .returning()
  )[0];

  return user;
}
