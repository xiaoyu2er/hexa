import { generateId } from "@/lib/utils";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId("u")),
  name: text("name"),
  username: text("username").unique().notNull(),
  password: text("password"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),

  defaultWorkspaceId: text("default_workspace_id").references(
    () => workspaceTable.id,
  ),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
});

export const tokenTypeEnum = pgEnum("tokenType", [
  "RESET_PASSWORD",
  "VERIFY_EMAIL",
  "LOGIN_PASSCODE",
]);
export type TokenType = (typeof tokenTypeEnum.enumValues)[number];

export const tokenTable = pgTable("token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId("token")),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  type: tokenTypeEnum("type").notNull(),
  code: text("code").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
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

export const providerEnum = pgEnum("providerEnum", ["GOOGLE", "GITHUB"]);
export type ProviderType = (typeof providerEnum.enumValues)[number];

export const oauthAccountTable = pgTable(
  "oauth_account",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => generateId("oauth")),
    // .primaryKey(),
    userId: text("user_id")
      // userId can be null if the user didn't finish the sign-up process (setup passwo  rd and username)
      // .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    provider: providerEnum("provider").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    email: text("email").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    username: text("username"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).$onUpdate(() => new Date()),
  },
  // primaryKey [provider, providerAccountId]
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
    // unq: unique().on(t.provider, t.providerAccountId),
  }),
);

export const userOAuthAccountRelations = relations(userTable, ({ many }) => ({
  oauthAccounts: many(oauthAccountTable),
}));

export const oauthAccountUserRelation = relations(
  oauthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [oauthAccountTable.userId],
      references: [userTable.id],
    }),
  }),
);

export const emailTable = pgTable("email", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId("em")),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  primary: boolean("primary").notNull().default(false),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
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

export const workspaceTable = pgTable("workspace", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId("ws")),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).$onUpdate(() => new Date()),
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
    workspaceMembers: many(workspaceMemberTable),
  }),
);

export const workspaceUserRoleEnum = pgEnum("workspaceUserRole", [
  "OWNER",
  "ADMIN",
  "MEMBER",
]);

export type WorkspaceUserRole =
  (typeof workspaceUserRoleEnum.enumValues)[number];
export const workspaceMemberTable = pgTable(
  "workspace_member",
  {
    id: text("id")
      // .primaryKey()
      .$defaultFn(() => generateId("wsm")),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaceTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    role: workspaceUserRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).$onUpdate(() => new Date()),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.workspaceId] }),
  }),
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
  }),
);

// export const inviteTable = pgTable(
//   "invite",
//   {
//     id: text("id")
//       .primaryKey()
//       .$defaultFn(() => generateId("i")),
//     email: text("email").notNull(),
//     workspaceId: text("workspace_id")
//       .notNull()
//       .references(() => workspaceTable.id, { onDelete: "cascade" }),
//     role: workspaceUserRoleEnum("role").notNull(),
//     createdAt: timestamp("created_at", {
//       withTimezone: true,
//       mode: "date",
//     })
//       .notNull()
//       .defaultNow(),
//     expiresAt: timestamp("expires_at", {
//       withTimezone: true,
//       mode: "date",
//     })
//       .notNull()
//       // Expires in 24 hours
//       .$defaultFn(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
//   },
//   (t) => ({
//     unq: unique().on(t.email, t.workspaceId),
//   })
// );

export type UserModel = typeof userTable.$inferSelect;
export type OAuthAccountModel = typeof oauthAccountTable.$inferSelect;
export type EmailModal = typeof emailTable.$inferSelect;
export type SessionModel = typeof sessionTable.$inferSelect;
export type TokenModel = typeof tokenTable.$inferSelect;
export type WorkspaceModel = typeof workspaceTable.$inferSelect;
export type WorkspaceMemberModel = typeof workspaceMemberTable.$inferSelect;
