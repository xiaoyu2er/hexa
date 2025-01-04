import { generateId } from '@hexa/lib';
import { projectTable } from '@hexa/server/table/project';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$default(() => generateId('u')),
  name: text('name'),
  password: text('password'),
  avatarUrl: text('avatar_url'),
  defaultProjectId: text('default_project_id').references(
    () => projectTable.id
  ),
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
