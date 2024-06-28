import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db";
import { sessionTable, userTable, type UserModel as DbUser } from "@/db/schema";
import omit from "lodash/omit";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (attributes) => {
    // console.log("getSessionAttributes", attributes);
    return attributes;
  },
  getUserAttributes: (attributes) => {
    // console.log("getUserAttributes", attributes);
    return omit(attributes, ["hashedPassword"]);
  },

  /**
   * Session lifetime: wow long a session lasts for inactive users
   * Sessions do not have an absolute expiration. The expiration gets extended whenever they're used. This ensures that active users remain signed in, while inactive users are signed out.
   * More specifically, if the session expiration is set to 30 days (default), Lucia will extend the expiration by another 30 days when there are less than 15 days (half of the expiration) until expiration. You can configure the expiration with the sessionExpiresIn configuration.
   */
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    // Cookie name (default: auth_session)
    name: "hexa-session",
    // Set to false for cookies to persist indefinitely (default: true)
    expires: false,
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
