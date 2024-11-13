import { generateId } from '@/lib/utils';
import { relations, sql } from 'drizzle-orm';

import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

const expiresAt = {
  expiresAt: integer('expires_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};

export const userTable = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('u')),
  name: text('name'),
  username: text('username').unique().notNull(),
  password: text('password'),
  avatarUrl: text('avatar_url'),

  defaultWorkspaceId: text('default_workspace_id').references(
    () => workspaceTable.id
  ),
});

const userIdNotNull = {
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
};

const userIdNullable = {
  userId: text('user_id').references(() => userTable.id, {
    onDelete: 'cascade',
  }),
};

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  ...userIdNotNull,
  ...expiresAt,
});

export type OtpType = 'RESET_PASSWORD' | 'VERIFY_EMAIL' | 'LOGIN_PASSCODE';
const otpType = {
  type: text('type').$type<OtpType>().notNull(),
};
export const tokenTable = sqliteTable('token', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('token')),
  ...userIdNotNull,
  email: text('email').notNull(),
  ...otpType,
  code: text('code').notNull(),
  token: text('token').notNull(),
  ...expiresAt,
});

export const userTokenRelation = relations(userTable, ({ many }) => ({
  tokens: many(tokenTable),
}));

export const tokenUserRelation = relations(tokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [tokenTable.userId],
    references: [userTable.id],
  }),
}));

export type ProviderType = 'GOOGLE' | 'GITHUB';
const providerType = {
  provider: text('provider').$type<ProviderType>().default('GOOGLE').notNull(),
};
export const oauthAccountTable = sqliteTable(
  'oauth_account',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => generateId('oauth'))
      .primaryKey(),
    ...userIdNullable,
    ...providerType,
    name: text('name'),
    avatarUrl: text('avatar_url'),
    email: text('email').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    username: text('username'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
  })
);

export const userOauthAccountRelations = relations(userTable, ({ many }) => ({
  oauthAccounts: many(oauthAccountTable),
}));

export const oauthAccountUserRelation = relations(
  oauthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [oauthAccountTable.userId],
      references: [userTable.id],
    }),
  })
);

export const emailTable = sqliteTable('email', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('em')),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  primary: integer('primary', { mode: 'boolean' }).notNull().default(false),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
});

export const userEmailRelations = relations(userTable, ({ many }) => ({
  emails: many(emailTable),
}));

export const emailUserRelations = relations(emailTable, ({ one }) => ({
  user: one(userTable, {
    fields: [emailTable.userId],
    references: [userTable.id],
  }),
}));

export const workspaceTable = sqliteTable('workspace', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('ws')),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  avatarUrl: text('avatar_url'),
});

export const userWorkspaceRelations = relations(userTable, ({ many, one }) => ({
  workspaces: many(workspaceMemberTable),
  defaultWorkspace: one(workspaceTable, {
    fields: [userTable.defaultWorkspaceId],
    references: [workspaceTable.id],
  }),
}));

export const workspaceMemberRelations = relations(
  workspaceTable,
  ({ many }) => ({
    members: many(workspaceMemberTable),
  })
);
export type WorkspaceUserRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export const workspaceUserRoleType = {
  // biome-ignore lint/nursery/noSecrets: <explanation>
  role: text('workspaceUserRole')
    .$type<WorkspaceUserRole>()
    .default('MEMBER')
    .notNull(),
};

const workspaceId = {
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaceTable.id, { onDelete: 'cascade' }),
};
export const workspaceMemberTable = sqliteTable(
  'workspace_member',
  {
    id: text('id')
      // .primaryKey()
      .$defaultFn(() => generateId('wsm')),
    ...workspaceId,
    ...userIdNotNull,
    ...workspaceUserRoleType,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.workspaceId] }),
  })
);

export const usersToWorkspaceRelation = relations(
  workspaceMemberTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [workspaceMemberTable.userId],
      references: [userTable.id],
    }),
    workspace: one(workspaceTable, {
      fields: [workspaceMemberTable.workspaceId],
      references: [workspaceTable.id],
    }),
  })
);

export type UserModel = typeof userTable.$inferSelect;
export type OauthAccountModel = typeof oauthAccountTable.$inferSelect;
export type EmailModal = typeof emailTable.$inferSelect;
export type SessionModel = typeof sessionTable.$inferSelect;
export type TokenModel = typeof tokenTable.$inferSelect;
export type WorkspaceModel = typeof workspaceTable.$inferSelect;
export type WorkspaceMemberModel = typeof workspaceMemberTable.$inferSelect;
export type WorkspaceWithMembersModel = typeof workspaceTable.$inferSelect & {
  members: WorkspaceMemberModel[];
};
