import { generateId } from '@/lib/utils';
import { type Simplify, relations, sql } from 'drizzle-orm';
import {
  check,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const expiresAt = {
  expiresAt: integer('expires_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};
const createdAt = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};
export const tmpUserTable = sqliteTable('tmp_user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('pr')),
  email: text('email').notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
});

export const userTable = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('u')),
  name: text('name').unique().notNull(),
  displayName: text('display_name'),
  password: text('password'),
  avatarUrl: text('avatar_url'),
  defaultWsId: text('default_ws_id').references(() => workspaceTable.id),
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

export const PasscodeTypeSchema = z.enum([
  'RESET_PASSWORD',
  'VERIFY_EMAIL',
  'LOGIN_PASSCODE',
  'SIGN_UP',
]);

export type PasscodeType = z.infer<typeof PasscodeTypeSchema>;

const passcodeType = {
  type: text('type').$type<PasscodeType>().notNull(),
};

export const tokenTable = sqliteTable('token', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('token')),
  // UserId can be users or pending registrations
  ...userIdNullable,
  tmpUserId: text('tmp_user_id').references(() => tmpUserTable.id, {
    onDelete: 'cascade',
  }),
  email: text('email').notNull(),
  ...passcodeType,
  code: text('code').notNull(),
  token: text('token').notNull(),
  ...expiresAt,
});

export const ProviderTypeSchema = z.enum(['GOOGLE', 'GITHUB']);
export type ProviderType = z.infer<typeof ProviderTypeSchema>;

const providerType = {
  provider: text('provider').$type<ProviderType>().default('GOOGLE').notNull(),
};

export const oauthAccountTable = sqliteTable(
  'oauth_account',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => generateId('oauth')),
    ...userIdNullable,
    ...providerType,
    name: text('name'),
    avatarUrl: text('avatar_url'),
    email: text('email').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    username: text('username').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
  })
);

export const oauthAccountRelations = relations(
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

export const orgTable = sqliteTable('org', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('org')),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  desc: text('desc'),
});

const OwnerTypeSchema = z.enum(['USER', 'ORG']);
type OwnerType = z.infer<typeof OwnerTypeSchema>;

// Repository table (similar to GitHub repos)
export const workspaceTable = sqliteTable('workspace', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('ws')),
  name: text('name').notNull(),
  desc: text('desc'),
  avatarUrl: text('avatar_url'),
  ...createdAt,
});

// Then, create a separate workspace owner table with proper constraints
export const workspaceOwnerTable = sqliteTable(
  'workspace_owner',
  {
    wsId: text('ws_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => userTable.id, {
      onDelete: 'cascade',
    }),
    orgId: text('org_id').references(() => orgTable.id, {
      onDelete: 'cascade',
    }),
    ownerType: text('owner_type').$type<OwnerType>().notNull(),
  },
  (t) => ({
    // Ensure each workspace has exactly one owner
    pk: primaryKey({ columns: [t.wsId] }),

    // Ensure either userId or orgId is set based on ownerType, but not both
    ownerTypeCheck: check(
      'owner_check',
      sql`
      (${t.ownerType} = 'USER' AND ${t.userId} IS NOT NULL AND ${t.orgId} IS NULL) OR
      (${t.ownerType} = 'ORG' AND ${t.userId} IS NULL AND ${t.orgId} IS NOT NULL)
    `
    ),
  })
);

// Organization members (replacing workspace_member)
export type OrgRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export const orgMemberTable = sqliteTable(
  'org_member',
  {
    id: text('id').$defaultFn(() => generateId('orgm')),
    orgId: text('org_id')
      .notNull()
      .references(() => orgTable.id, { onDelete: 'cascade' }),
    ...userIdNotNull,
    role: text('role').$type<OrgRole>().default('MEMBER').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.orgId] }),
  })
);

// URL table
export const shortUrlTable = sqliteTable('short_url', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('url')),
  repositoryId: text('repository_id')
    .notNull()
    .references(() => workspaceTable.id, { onDelete: 'cascade' }),
  creatorId: text('creator_id')
    .notNull()
    .references(() => userTable.id),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').unique().notNull(),
  title: text('title'),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  clicks: integer('clicks').notNull().default(0),
});

// Relations
export const userRelations = relations(userTable, ({ many, one }) => ({
  emails: many(emailTable),
  tokens: many(tokenTable),
  oauthAccounts: many(oauthAccountTable),
  defaultWs: one(workspaceTable, {
    fields: [userTable.defaultWsId],
    references: [workspaceTable.id],
  }),
}));

export const tmpUserRelations = relations(tmpUserTable, ({ many }) => ({
  tokens: many(tokenTable),
}));

export const emailRelations = relations(emailTable, ({ one }) => ({
  user: one(userTable, {
    fields: [emailTable.userId],
    references: [userTable.id],
  }),
}));

export const tokenRelations = relations(tokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [tokenTable.userId],
    references: [userTable.id],
  }),
  tmpUser: one(tmpUserTable, {
    fields: [tokenTable.tmpUserId],
    references: [tmpUserTable.id],
  }),
}));

export const orgRelations = relations(orgTable, ({ many, one }) => ({
  members: many(orgMemberTable),
  workspaces: many(workspaceTable),
}));

// Organization member relations
export const orgMemberRelations = relations(orgMemberTable, ({ one }) => ({
  org: one(orgTable, {
    fields: [orgMemberTable.orgId],
    references: [orgTable.id],
  }),
  user: one(userTable, {
    fields: [orgMemberTable.userId],
    references: [userTable.id],
  }),
}));

// Repository relations
export const workspaceRelations = relations(
  workspaceTable,
  ({ one, many }) => ({
    owner: one(workspaceOwnerTable, {
      fields: [workspaceTable.id],
      references: [workspaceOwnerTable.wsId],
    }),
    shortUrls: many(shortUrlTable),
  })
);

export const workspaceOwnerRelations = relations(
  workspaceOwnerTable,
  ({ one }) => ({
    workspace: one(workspaceTable, {
      fields: [workspaceOwnerTable.wsId],
      references: [workspaceTable.id],
    }),
    user: one(userTable, {
      fields: [workspaceOwnerTable.userId],
      references: [userTable.id],
    }),
    org: one(orgTable, {
      fields: [workspaceOwnerTable.orgId],
      references: [orgTable.id],
    }),
  })
);

export const shortUrlRelations = relations(shortUrlTable, ({ one }) => ({
  workspace: one(workspaceTable, {
    fields: [shortUrlTable.repositoryId],
    references: [workspaceTable.id],
  }),
  creator: one(userTable, {
    fields: [shortUrlTable.creatorId],
    references: [userTable.id],
  }),
}));

// ========== Insert and Select Schemas & Types ==========
// User
export const InsertUserSchema = createInsertSchema(userTable);
export type InsertUserType = z.infer<typeof InsertUserSchema>;
export const SelectUserSchema = createSelectSchema(userTable);
export type SelectUserType = Simplify<z.infer<typeof SelectUserSchema>>;

// Email
export const InsertEmailSchema = createInsertSchema(emailTable);
export type InsertEmailType = z.infer<typeof InsertEmailSchema>;
export const SelectEmailSchema = createSelectSchema(emailTable);
export type SelectEmailType = z.infer<typeof SelectEmailSchema>;

// Workspace Owner
export const InsertWorkspaceOwnerSchema = createInsertSchema(
  workspaceOwnerTable,
  {
    ownerType: OwnerTypeSchema,
  }
);
export type InsertWorkspaceOwnerType = z.infer<
  typeof InsertWorkspaceOwnerSchema
>;
export const SelectWorkspaceOwnerSchema = createSelectSchema(
  workspaceOwnerTable,
  {
    ownerType: OwnerTypeSchema,
  }
);
export type SelectWorkspaceOwnerType = z.infer<
  typeof SelectWorkspaceOwnerSchema
>;

// Workspace
export const InsertWorkspaceSchema = createInsertSchema(workspaceTable).extend({
  ownerId: z.string(),
  ownerType: OwnerTypeSchema,
});

export type InsertWorkspaceType = Simplify<
  z.infer<typeof InsertWorkspaceSchema>
>;
export const SelectWorkspaceSchema = createSelectSchema(workspaceTable, {
  createdAt: z.string(),
}).extend({
  owner: SelectWorkspaceOwnerSchema.omit({
    userId: true,
    orgId: true,
    wsId: true,
  })
    .extend({
      ownerName: z.string(),
      ownerId: z.string(),
    })
    .nullable(),
});
export type SelectWorkspaceType = z.infer<typeof SelectWorkspaceSchema>;

// Org
export const InsertOrgSchema = createInsertSchema(orgTable);
export type InsertOrgType = z.infer<typeof InsertOrgSchema>;
export const SelectOrgSchema = createSelectSchema(orgTable);
export type SelectOrgType = z.infer<typeof SelectOrgSchema>;
export type SelectUserOrgType = SelectOrgType & {
  role: OrgRole;
};

// Oauth Account
export const InsertOauthAccountSchema = createInsertSchema(oauthAccountTable);
export type InsertOauthAccountType = z.infer<typeof InsertOauthAccountSchema>;
export const SelectOauthAccountSchema = createSelectSchema(oauthAccountTable);
export type SelectOauthAccountType = z.infer<typeof SelectOauthAccountSchema>;

// Session
export const InsertSessionSchema = createInsertSchema(sessionTable);
export type InsertSessionType = z.infer<typeof InsertSessionSchema>;
export const SelectSessionSchema = createSelectSchema(sessionTable, {
  expiresAt: z.string(),
});
export type SelectSessionType = z.infer<typeof SelectSessionSchema>;

// Org Member
export const InsertOrgMemberSchema = createInsertSchema(orgMemberTable);
export type InsertOrgMemberType = z.infer<typeof InsertOrgMemberSchema>;
export const SelectOrgMemberSchema = createSelectSchema(orgMemberTable);
export type SelectOrgMemberType = z.infer<typeof SelectOrgMemberSchema>;

// Short Url
export const InsertShortUrlSchema = createInsertSchema(shortUrlTable);
export type InsertShortUrlType = z.infer<typeof InsertShortUrlSchema>;
export const SelectShortUrlSchema = createSelectSchema(shortUrlTable, {
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
});
export type SelectShortUrlType = z.infer<typeof SelectShortUrlSchema>;

// Token
export const InsertTokenSchema = createInsertSchema(tokenTable, {
  type: PasscodeTypeSchema,
});
export type InsertTokenType = z.infer<typeof InsertTokenSchema>;
export const SelectTokenSchema = createSelectSchema(tokenTable, {
  expiresAt: z.string(),
});
export type SelectTokenType = z.infer<typeof SelectTokenSchema>;
export const FindTokenByEmailSchema = InsertTokenSchema.pick({
  tmpUserId: true,
  userId: true,
  email: true,
  type: true,
});
export const FindTokenByTokenSchema = InsertTokenSchema.pick({
  token: true,
  type: true,
});
export type FindTokenByEmailType = z.infer<typeof FindTokenByEmailSchema>;
export type FindTokenByTokenType = z.infer<typeof FindTokenByTokenSchema>;

export const VerifyTokenSchema = SelectTokenSchema.pick({
  code: true,
  token: true,
  email: true,
  type: true,
  tmpUserId: true,
}).partial({
  code: true,
  token: true,
  tmpUserId: true,
});

export type VerifyTokenType = z.infer<typeof VerifyTokenSchema>;

export const SelectOwnerSchema = z.object({
  id: z.string(),
  type: OwnerTypeSchema,
  name: z.string(),
  avatarUrl: z.string().nullable(),
  desc: z.string().nullable(),
  role: z.string().nullable(),
});
export type SelectOwnerType = z.infer<typeof SelectOwnerSchema>;
