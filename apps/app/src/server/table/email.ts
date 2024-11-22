import { generateId } from '@/lib/crypto';
import { lower } from '@/server/table/common';
import { userIdNotNull } from '@/server/table/user';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const emailTable = sqliteTable(
  'email',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('email')),
    ...userIdNotNull,
    email: text('email').notNull(),
    primary: integer('primary', { mode: 'boolean' }).notNull().default(false),
    verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
  },
  (t) => ({
    emailIndex: uniqueIndex('email_index').on(t.userId, lower(t.email)),
    userIdIndex: index('email_user_id_index').on(t.userId),
  })
);

export default {
  emailTable,
};
