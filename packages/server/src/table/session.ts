import { generateId } from '@hexa/lib';
import { expiresAt } from '@hexa/server/table/common';
import { userIdNotNull } from '@hexa/server/table/user';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sessionTable = sqliteTable('session', {
  id: text('id')
    .primaryKey()
    .$default(() => generateId('sess')),
  ...userIdNotNull,
  ...expiresAt,
});

export default {
  sessionTable,
};
