import { generateId } from '@hexa/lib';
import type { InviteStatusType } from '@hexa/server/schema/org-invite';
import type { OrgMemberRoleType } from '@hexa/server/schema/org-member';
import { createdAt, expiresAt } from '@hexa/server/table/common';
import { orgIdNotNull } from '@hexa/server/table/org';
import { userTable } from '@hexa/server/table/user';
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
      .references(() => userTable.id, { onDelete: 'cascade' }),
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
