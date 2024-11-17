import { generateId } from '@/lib/utils';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Repository table (similar to GitHub repos)
export const workspaceTable = sqliteTable('workspace', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('ws')),
  name: text('name').notNull(),
  desc: text('desc'),
  avatarUrl: text('avatar_url'),
});

export default {
  workspaceTable,
};
