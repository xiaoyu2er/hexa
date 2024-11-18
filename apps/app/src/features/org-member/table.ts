import type { OrgRole } from '@/features/org-member/schema';
import { orgTable } from '@/features/org/table';
import { userIdNotNull } from '@/features/user/table';
import { generateId } from '@/lib/crypto';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const orgMemberTable = sqliteTable(
  'org_member',
  {
    id: text('id').$defaultFn(() => generateId('orgm')),
    orgId: text('org_id')
      .notNull()
      .references(() => orgTable.id, { onDelete: 'cascade' }),
    ...userIdNotNull,
    role: text('role').$type<OrgRole>().default('MEMBER').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.orgId] }),
  })
);

export default {
  orgMemberTable,
};
