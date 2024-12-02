import { generateId } from '@/lib/crypto';
import type {
  DomainStatus,
  DomainType,
  SslStatus,
} from '@/server/schema/domain';
import { createdAt, lastCheckedAt } from '@/server/table/common';
import { orgIdNotNull } from '@/server/table/org';
import { projectIdNotNull } from '@/server/table/project';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const domainTable = sqliteTable(
  'domain',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('dom')),
    type: text('type').default('CUSTOM').$type<DomainType>(),
    hostname: text('hostname').notNull(),
    verified: integer('verified', { mode: 'boolean' }).default(false).notNull(),
    placeholder: text('placeholder'),
    notFoundUrl: text('not_found_url'),
    archived: integer('archived', { mode: 'boolean' }).default(false).notNull(),
    cloudflareId: text('cloudflare_id'),
    hostnameStatus: text('hostname_status').$type<DomainStatus>().notNull(),
    sslStatus: text('ssl_status').$type<SslStatus>().notNull(),
    avatarUrl: text('avatar_url'),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
    ...orgIdNotNull,
    ...createdAt,
    ...lastCheckedAt,
  },
  (t) => ({
    hostnameIndex: uniqueIndex('domain_hostname_idx').on(t.hostname),
    orgIndex: index('domain_org_idx').on(t.orgId),
    lastCheckedIndex: index('domain_last_checked_idx').on(t.lastCheckedAt),
  })
);

export const domainIdNotNull = {
  domainId: text('domain_id')
    .notNull()
    .references(() => domainTable.id, { onDelete: 'cascade' }),
};

export const projectDomainTable = sqliteTable('project_domain', {
  ...projectIdNotNull,
  ...domainIdNotNull,
  primary: integer('primary', { mode: 'boolean' }).default(false),
});
