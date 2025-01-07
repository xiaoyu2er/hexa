import { generateId } from '@hexa/lib';
import { createdAt } from '@hexa/server/table/common';
import { projectIdNotNull } from '@hexa/server/table/project';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
// URL table
export const tagTable = sqliteTable(
  'tag',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('tag')),
    ...projectIdNotNull,
    ...createdAt,
    name: text('name').notNull(),
  },
  (t) => ({
    tagProjectIdNameIndex: uniqueIndex('tag_projectId_name_index').on(
      t.projectId,
      t.name
    ),
    projectIndex: index('tag_project_index').on(t.projectId),
  })
);

export const tagIdNotNull = {
  tagId: text('tag_id')
    .notNull()
    .references(() => tagTable.id, { onDelete: 'cascade' }),
};
