import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Session, User } from 'lucia';

import type { schema } from '@/server/db/index';
import type {
  SelectOrgMemberType,
  SelectWorkspaceType,
} from '@/server/db/schema';
import type { ExecutionContext } from 'hono';

export type DbSchema = typeof schema;

export type DbType = DrizzleD1Database<DbSchema>;
declare module 'hono' {
  interface ContextVariableMap {}

  interface HonoRequest {
    cf: Record<string, unknown>;
  }
  interface Context {
    ctx: ExecutionContext;
  }
}
export type ContextVariables = {
  db: DbType;
  user: User;
  userId: User['id'];
  session: Session;
  ws: SelectWorkspaceType;
  wsId: string;
  wsMember: SelectOrgMemberType;
};

export type Context = {
  Variables: ContextVariables;
  // biome-ignore lint/style/useNamingConvention: <explanation>
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  Bindings: CloudflareEnv;
};
