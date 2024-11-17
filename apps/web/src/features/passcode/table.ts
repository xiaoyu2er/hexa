import { expiresAt } from '@/features/common/table';
import type { PasscodeType } from '@/features/passcode/schema';
import { tmpUserTable } from '@/features/tmp-user/table';
import { userIdNullable } from '@/features/user/table';
import { generateId } from '@/lib/crypto';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

const passcodeType = {
  type: text('type').$type<PasscodeType>().notNull(),
};

export const passcodeTable = sqliteTable('passcode', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId('token')),
  // UserId can be users or pending registrations
  ...userIdNullable,
  tmpUserId: text('tmp_user_id').references(() => tmpUserTable.id, {
    onDelete: 'cascade',
  }),
  email: text('email').notNull(),
  ...passcodeType,
  code: text('code').notNull(),
  token: text('token').notNull(),
  ...expiresAt,
});

export default {
  passcodeTable,
};
