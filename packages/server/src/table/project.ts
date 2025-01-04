import { generateId } from '@hexa/lib';
import { orgIdNotNull } from '@hexa/server/table/org';
import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const projectTable = sqliteTable(
  'project',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('proj')),
    slug: text('slug').notNull(),
    ...orgIdNotNull,
    name: text('name').notNull(),
    desc: text('desc'),
    avatarUrl: text('avatar_url'),
  },
  (t) => ({
    slugIdx: uniqueIndex('project_slug_idx').on(t.slug),
    orgIndex: index('project_org_index').on(t.orgId),
  })
);

export const projectIdNotNull = {
  projectId: text('project_id')
    .notNull()
    .references(() => projectTable.id, { onDelete: 'cascade' }),
};

export default {
  projectTable,
};

