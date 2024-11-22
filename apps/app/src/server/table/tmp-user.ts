import { generateId } from '@/lib/crypto';
import { oauthAccountIdNullable } from '@/server/table/oauth';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tmpUserTable = sqliteTable('tmp_user', {
  id: text('id')
    .primaryKey()
    .$default(() => generateId('tmpu')),
  email: text('email').notNull().unique(),
  password: text('password'),
  name: text('name').notNull(),
  orgName: text('org_name'),
  ...oauthAccountIdNullable,
});

export const tmpUserIdNullable = {
  tmpUserId: text('tmp_user_id').references(() => tmpUserTable.id, {
    onDelete: 'cascade',
  }),
};

export const tmpUserIdNotNull = {
  tmpUserId: text('tmp_user_id')
    .notNull()
    .references(() => tmpUserTable.id, {
      onDelete: 'cascade',
    }),
};

export default {
  tmpUserTable,
};
