import { generateId } from '@/lib/crypto';
import type { InviteStatus } from '@/server/schema/invite';
import type { OrgMemberRole } from '@/server/schema/org-memeber';
import { expiresAt, lower } from '@/server/table/common';
import { orgIdNotNull } from '@/server/table/org';
import { userTable } from '@/server/table/user';
import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const inviteTable = sqliteTable(
  'invite',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('invite')),
    token: text('token').notNull(),
    role: text('role').$type<OrgMemberRole>().default('MEMBER').notNull(),
    status: text('status').$type<InviteStatus>().default('PENDING').notNull(),
    ...orgIdNotNull,
    // inviter
    inviterId: text('inviter_id')
      .notNull()
      .references(() => userTable.id),
    // invitee
    email: text('email').notNull(),
    name: text('name'),
    ...expiresAt,
  },
  (t) => ({
    orgInviteIndex: uniqueIndex('invite_org_email_index').on(
      t.orgId,
      lower(t.email)
    ),
    orgIdIndex: index('invite_org_id_index').on(t.orgId),
  })
);

export default {
  inviteTable,
};
