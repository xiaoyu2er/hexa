import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db";
import { sessionTable, userTable, type User as DbUser } from "@/db/schema";
import omit from "lodash/omit";
const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (attributes) => attributes,
  getUserAttributes: (attributes) => {
    return omit(attributes, ["hashedPassword"]);
  },
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    name: "session",
    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }

  interface DatabaseSessionAttributes {}
  interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> {}
}
