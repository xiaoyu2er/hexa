import { generateId } from '@hexa/lib';
import type { PasscodeType } from '@hexa/server/schema/passcode';
import { expiresAt } from '@hexa/server/table/common';
import { tmpUserIdNullable } from '@hexa/server/table/tmp-user';
import { userIdNullable } from '@hexa/server/table/user';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

const passcodeType = {
  type: text('type').$type<PasscodeType>().notNull(),
};

export const passcodeTable = sqliteTable('passcode', {
  id: text('id')
    .primaryKey()
    .$default(() => generateId('pass')),
  // UserId can be users or pending registrations
  ...userIdNullable,
  ...tmpUserIdNullable,
  email: text('email').notNull(),
  ...passcodeType,
  code: text('code').notNull(),
  token: text('token').notNull(),
  ...expiresAt,
});

export default {
  passcodeTable,
};
