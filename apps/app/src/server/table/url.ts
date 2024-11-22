import { generateId } from '@/lib/crypto';
import { projectIdNotNull } from '@/server/table/project';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

// URL table
export const urlTable = sqliteTable(
  'short_url',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('url')),
    ...projectIdNotNull,
    destUrl: text('dest_url').notNull(),
    slug: text('slug').notNull(),
    title: text('title'),
    desc: text('desc'),
    clicks: integer('clicks').notNull().default(0),
  },
  (t) => ({
    slugIndex: uniqueIndex('url_slug_index').on(t.slug),
    projectIndex: index('url_project_index').on(t.projectId),
  })
);

export default {
  urlTable,
};
