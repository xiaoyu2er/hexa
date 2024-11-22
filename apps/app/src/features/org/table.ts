import { generateId } from '@/lib/crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const orgTable = sqliteTable('org', {
  id: text('id')
    .primaryKey()
    .$default(() => generateId('org')),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  desc: text('desc'),
});

export const orgIdNotNull = {
  orgId: text('org_id')
    .notNull()
    .references(() => orgTable.id, { onDelete: 'cascade' }),
};

export default {
  orgTable,
};
