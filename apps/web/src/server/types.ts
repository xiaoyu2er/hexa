import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Session, User } from "lucia";

import type * as schema from "@/server/db/schema";
import type { ExecutionContext } from "hono";

export type DBSchema = typeof schema;

export type DBType = DrizzleD1Database<DBSchema>;
declare module "hono" {
  interface ContextVariableMap {
    db: DBType;
    user: User;
    userId: User["id"];
    session: Session;
    ws: schema.WorkspaceModel;
    wsMember: schema.WorkspaceMemberModel;
  }

  interface HonoRequest {
    cf: Record<string, unknown>;
  }
  interface Context {
    ctx: ExecutionContext;
  }
}
// export type ContextVariables = {};

export type Context = {
  // Variables: ContextVariables;
  Bindings: CloudflareEnv;
};
