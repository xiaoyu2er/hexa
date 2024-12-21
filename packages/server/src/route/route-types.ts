import type { DbSchema } from '@hexa/server/db';
import type { GitHubUser, GoogleUser } from '@hexa/server/schema/oauth';
import type { SelectOrgType } from '@hexa/server/schema/org';
import type { SelectInviteType } from '@hexa/server/schema/org-invite';
import type { SelectedPasscodeType } from '@hexa/server/schema/passcode';
import type { SelectProjectType } from '@hexa/server/schema/project';
import type { SelectTmpUserType } from '@hexa/server/schema/tmp-user';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { ExecutionContext, ValidationTargets } from 'hono';
// @ts-ignore
import type { Session, User } from 'lucia';
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
  org: SelectOrgType;
  orgId: string;
  invite: SelectInviteType;
};

export type Context = {
  Variables: ContextVariables;
  // biome-ignore lint/style/useNamingConvention: <explanation>
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  Bindings: CloudflareEnv;
};

export type ValidTarget = Simplify<keyof ValidationTargets>;
