import { generateId } from '@/lib/crypto';
import { createdAt } from '@/server/table/common';
import { projectIdNotNull } from '@/server/table/project';
import type { LinkRule } from '@hexa/const/rule';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
// URL table
export const linkTable = sqliteTable(
  'link',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('link')),
    ...projectIdNotNull,
    ...createdAt,
    destUrl: text('dest_url').notNull(),
    slug: text('slug').notNull(),
    title: text('title'),
    desc: text('desc'),
    domain: text('domain').notNull(),
    rules: text('rules', { mode: 'json' }).$type<LinkRule[]>(),
    clicks: integer('clicks').default(0),
  },
  (t) => ({
    urlDomainSlugIndex: uniqueIndex('url_domain_slug_index').on(
      t.domain,
      t.slug
    ),
    projectIndex: index('url_project_index').on(t.projectId),
  })
);
