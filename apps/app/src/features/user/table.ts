import { workspaceTable } from '@/features/workspace/table';
import { generateId } from '@/lib/crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export const userIdNotNull = {
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
};

export const userIdNullable = {
  userId: text('user_id').references(() => userTable.id, {
    onDelete: 'cascade',
  }),
};

export default {
  userTable,
};
