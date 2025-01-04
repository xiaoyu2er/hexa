import { generateId } from '@hexa/lib';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const orgTable = sqliteTable(
  'org',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('org')),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    avatarUrl: text('avatar_url'),
    desc: text('desc'),
  },
  (table) => ({
    slugIdx: uniqueIndex('slug_idx').on(table.slug),
  })
);

export const orgIdNotNull = {
  orgId: text('org_id')
    .notNull()
    .references(() => orgTable.id, { onDelete: 'cascade' }),
};

export default {
  orgTable,
};
