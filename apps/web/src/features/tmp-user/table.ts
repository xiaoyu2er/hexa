import { generateId } from '@/lib/utils';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tmpUserTable = sqliteTable('tmp_user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('pr')),
  email: text('email').notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
});

export default {
  tmpUserTable,
};
