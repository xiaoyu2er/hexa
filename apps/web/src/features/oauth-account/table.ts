import { primaryKey } from 'drizzle-orm/sqlite-core';

import { sqliteTable } from 'drizzle-orm/sqlite-core';

import type { ProviderType } from '@/features/oauth-account/schema';
import { userIdNullable } from '@/features/user/table';
import { generateId } from '@/lib/utils';
import { text } from 'drizzle-orm/sqlite-core';

export const providerType = {
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
export default {
  oauthAccountTable,
};
