import { index, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { sqliteTable } from 'drizzle-orm/sqlite-core';

import { generateId } from '@/lib/crypto';
import type { ProviderType } from '@/server/schema/oauth';
import { userIdNullable } from '@/server/table/user';
import { text } from 'drizzle-orm/sqlite-core';

export const providerType = {
  provider: text('provider').$type<ProviderType>().default('GOOGLE').notNull(),
};

export const oauthAccountTable = sqliteTable(
  'oauth_account',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('oa')),
    ...userIdNullable,
    ...providerType,
    name: text('name'),
    avatarUrl: text('avatar_url'),
    email: text('email').notNull(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).default(
      false
    ),
    providerAccountId: text('provider_account_id').notNull(),
    username: text('username').notNull(),
  },
  (t) => ({
    oauthAccountIndex: uniqueIndex('oauth_account_index').on(
      t.provider,
      t.providerAccountId
    ),
    userIdIndex: index('oauth_account_user_id_index').on(t.userId),
  })
);

export const oauthAccountIdNotNull = {
  oauthAccountId: text('oauth_account_id')
    .notNull()
    .references(() => oauthAccountTable.id, {
      onDelete: 'cascade',
    }),
};

export const oauthAccountIdNullable = {
  oauthAccountId: text('oauth_account_id').references(
    () => oauthAccountTable.id,
    {
      onDelete: 'cascade',
    }
  ),
};

export default {
  oauthAccountTable,
};
