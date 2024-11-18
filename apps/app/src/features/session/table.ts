import { expiresAt } from '@/features/common/table';
import { userIdNotNull } from '@/features/user/table';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  ...userIdNotNull,
  ...expiresAt,
});

export default {
  sessionTable,
};
