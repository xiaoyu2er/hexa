import { generateId } from '@/lib/crypto';
import type { InviteStatusType } from '@/server/schema/org-invite';
import type { OrgMemberRoleType } from '@/server/schema/org-member';
import { createdAt, expiresAt } from '@/server/table/common';
import { orgIdNotNull } from '@/server/table/org';
import { userTable } from '@/server/table/user';
import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const orgInviteTable = sqliteTable(
  'org_invite',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('inv')),
    token: text('token').notNull(),
    role: text('role').$type<OrgMemberRoleType>().default('MEMBER').notNull(),
    status: text('status')
      .$type<InviteStatusType>()
      .default('PENDING')
      .notNull(),
    ...orgIdNotNull,
    // inviter
    inviterId: text('inviter_id')
      .notNull()
      .references(() => userTable.id),
    // invitee
    email: text('email').notNull(),
    name: text('name'),
    ...createdAt,
    ...expiresAt,
  },
  (t) => ({
    inviteOrgEmailIndex: uniqueIndex('invite_org_email_index').on(
      t.orgId,
      t.email
    ),
    inviteOrgIdIndex: index('invite_org_id_index').on(t.orgId),
  })
);
