import type { OrgMemberRole } from '@/features/org-member/schema';
import { orgIdNotNull } from '@/features/org/table';
import { userIdNotNull } from '@/features/user/table';
import { generateId } from '@/lib/crypto';
import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const orgMemberTable = sqliteTable(
  'org_member',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('orgm')),
    ...orgIdNotNull,
    ...userIdNotNull,
    role: text('role').$type<OrgMemberRole>().default('MEMBER').notNull(),
  },
  (t) => ({
    orgMemberIndex: uniqueIndex('org_member_index').on(t.userId, t.orgId),
    userIdIndex: index('org_member_user_id_index').on(t.userId),
    orgIdIndex: index('org_member_org_id_index').on(t.orgId),
  })
);

export default {
  orgMemberTable,
};
