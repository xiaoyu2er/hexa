import { generateId } from '@/lib/crypto';
import { expiresAt } from '@/server/table/common';
import { userIdNotNull } from '@/server/table/user';
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
