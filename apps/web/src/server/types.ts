import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Session, User } from 'lucia';

import type { SelectOrgMemberType } from '@/features/org-member/schema';
import type { SelectWorkspaceType } from '@/features/workspace/schema';

import type { DbSchema } from '@/server/db';
import type { ExecutionContext } from 'hono';

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
