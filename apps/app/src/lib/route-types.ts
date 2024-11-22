import type { SelectProjectType } from '@/features/project/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Session, User } from 'lucia';

import type { GitHubUser, GoogleUser } from '@/features/auth/oauth/schema';
import type { SelectedPasscodeType } from '@/features/passcode/schema';
import type { SelectTmpUserType } from '@/features/tmp-user/schema';
import type { DbSchema } from '@/lib/db';
import type { ExecutionContext, ValidationTargets } from 'hono';
import type { Simplify } from 'type-fest';

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
  userId: string;
  session: Session;
  project: SelectProjectType;
  projectId: string;
  passcode: SelectedPasscodeType | undefined;
  providerUser: GoogleUser | GitHubUser | undefined;
  tmpUser: SelectTmpUserType | undefined;
};

export type Context = {
  Variables: ContextVariables;
  // biome-ignore lint/style/useNamingConvention: <explanation>
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  Bindings: CloudflareEnv;
};

export type ValidTarget = Simplify<keyof ValidationTargets>;
