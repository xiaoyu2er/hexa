import { orgTable } from '@/features/org/table';
import { userTable } from '@/features/user/table';
import type { OwnerType } from '@/features/workspace-owner/schema';
import { workspaceTable } from '@/features/workspace/table';
import { sql } from 'drizzle-orm';
import { check, text } from 'drizzle-orm/sqlite-core';
import { primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';

// Then, create a separate workspace owner table with proper constraints
export const workspaceOwnerTable = sqliteTable(
  'workspace_owner',
  {
    wsId: text('ws_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => userTable.id, {
      onDelete: 'cascade',
    }),
    orgId: text('org_id').references(() => orgTable.id, {
      onDelete: 'cascade',
    }),
    ownerType: text('owner_type').$type<OwnerType>().notNull(),
  },
  (t) => ({
    // Ensure each workspace has exactly one owner
    pk: primaryKey({ columns: [t.wsId] }),

    // Ensure either userId or orgId is set based on ownerType, but not both
    ownerTypeCheck: check(
      'owner_check',
      sql`
      (${t.ownerType} = 'USER' AND ${t.userId} IS NOT NULL AND ${t.orgId} IS NULL) OR
      (${t.ownerType} = 'ORG' AND ${t.userId} IS NULL AND ${t.orgId} IS NOT NULL)
    `
    ),
  })
);

export default {
  workspaceOwnerTable,
};
