import { generateId } from '@/lib/crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const orgTable = sqliteTable('org', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('org')),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  desc: text('desc'),
});

export default {
  orgTable,
};
