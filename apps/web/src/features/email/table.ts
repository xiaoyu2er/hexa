import { userTable } from '@/features/user/table';
import { generateId } from '@/lib/utils';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const emailTable = sqliteTable('email', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('em')),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  primary: integer('primary', { mode: 'boolean' }).notNull().default(false),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
});

export default {
  emailTable,
};
