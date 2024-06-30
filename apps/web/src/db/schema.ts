import { generateId, generateUserId } from "@/lib/utils";
import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUserId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  hashedPassword: text("hashed_password"),
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

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
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
]);
export type TokenType = (typeof tokenTypeEnum.enumValues)[number];

export const tokenTable = pgTable("token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
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

export const usersRelations = relations(userTable, ({ many }) => ({
  tokens: many(tokenTable),
}));

export const tokensRelations = relations(tokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [tokenTable.userId],
    references: [userTable.id],
  }),
}));

export const providerEnum = pgEnum("providerEnum", ["GOOGLE", "GITHUB"]);
export type ProviderType = (typeof providerEnum.enumValues)[number];

export const oauthAccountTable = pgTable("oauth_account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  provider: providerEnum("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
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

export type UserModel = typeof userTable.$inferSelect;
export type OAuthAccountModel = typeof oauthAccountTable.$inferSelect;
export type SessionModel = typeof sessionTable.$inferSelect;
export type TokenModel = typeof tokenTable.$inferSelect;
