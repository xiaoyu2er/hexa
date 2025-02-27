import { generateId } from '@hexa/lib';
import type { OrgMemberRoleType } from '@hexa/server/schema/org-member';
import { createdAt } from '@hexa/server/table/common';
import { orgIdNotNull } from '@hexa/server/table/org';
import { userIdNotNull } from '@hexa/server/table/user';
import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const orgMemberTable = sqliteTable(
  'org_member',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('orgm')),
    ...orgIdNotNull,
    ...userIdNotNull,
    role: text('role').$type<OrgMemberRoleType>().default('MEMBER').notNull(),
    ...createdAt,
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
