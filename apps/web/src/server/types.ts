import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Session, User } from "lucia";

import type * as schema from "@/server/db/schema";

export type DBSchema = typeof schema;

export type DBType = DrizzleD1Database<DBSchema>;

export type ContextVariables = {
  db: DBType;
  user: User | null;
  session: Session | null;
};
