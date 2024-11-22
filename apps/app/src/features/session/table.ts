import { expiresAt } from '@/features/common/table';
import { userIdNotNull } from '@/features/user/table';
import { generateId } from '@/lib/crypto';
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
