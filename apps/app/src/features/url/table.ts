import { userTable } from '@/features/user/table';
import { workspaceTable } from '@/features/workspace/table';
import { generateId } from '@/lib/crypto';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
  clicks: integer('clicks').notNull().default(0),
});

export default {
  shortUrlTable,
};
