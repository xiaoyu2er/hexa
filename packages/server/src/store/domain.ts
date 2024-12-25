import { ApiError } from '@hexa/lib';
import type { DbType } from '@hexa/server/route/route-types';
import type { PaginationType } from '@hexa/server/schema/common';
import type {
  CustomHostnameDetailsType,
  DomainStatus,
  DomainType,
  InsertDomainType,
  QueryDomainType,
  SslStatus,
} from '@hexa/server/schema/domain';
import type { SelectOrgType } from '@hexa/server/schema/org';
import { domainTable } from '@hexa/server/table/domain';
import { and, eq, sql } from 'drizzle-orm';

// Get domains for an organization
export async function getDomains(
  db: DbType,
  orgId: string,
  query: PaginationType
): Promise<{ rowCount: number; data: QueryDomainType[] }> {
  const conditions = [eq(domainTable.orgId, orgId)];
  const data = await db.query.domainTable.findMany({
    where: and(...conditions),
    limit: query.pageSize,
    offset: query.pageIndex * query.pageSize,
  });

  const [result] = await db
    .select({ count: sql`count(*)` })
    .from(domainTable)
    .where(and(...conditions));

  const rowCount = Number(result?.count) ?? 0;

  return {
    rowCount,
    data: data as unknown as QueryDomainType[],
  };
}

// Get single domain
export async function getDomain(db: DbType, domainId: string) {
  return await db.query.domainTable.findFirst({
    where: eq(domainTable.id, domainId),
  });
}

// Create new domain
export async function createDomain(
  db: DbType,
  {
    details,
    org,
    isPublic,
  }: {
    details: CustomHostnameDetailsType;
    org: SelectOrgType;
    isPublic: boolean;
  }
) {
  const values = {
    type: isPublic ? 'PUBLIC' : ('CUSTOM' as DomainType),
    hostname: details.hostname,
    verified: details.status === 'active' && details.ssl.status === 'active',
    notFoundUrl: null,
    avatarUrl: null,
    placeholder: null,
    archived: false,
    lastChecked: new Date(),
    hostnameStatus: details.status as DomainStatus,
    sslStatus: details.ssl.status as SslStatus,
    orgId: org.id,
    cloudflareId: details.id,
    expiresAt: details.ssl.certificates?.[0]?.expires_on
      ? new Date(details.ssl.certificates[0].expires_on)
      : null,
  };

  const [domain] = await db.insert(domainTable).values(values).returning();

  return domain;
}

// Update domain
export async function updateDomain(
  db: DbType,
  {
    domainId,
    ...data
  }: { domainId: string; userId: string } & Partial<InsertDomainType>
) {
  const domain = await getDomain(db, domainId);
  if (!domain) {
    throw new ApiError('NOT_FOUND', 'Domain not found');
  }

  return (
    await db
      .update(domainTable)
      .set(data)
      .where(eq(domainTable.id, domainId))
      .returning()
  )[0];
}

// Delete domain
export async function deleteDomain(
  db: DbType,
  { domainId }: { domainId: string }
) {
  const domain = await getDomain(db, domainId);
  if (!domain) {
    throw new ApiError('NOT_FOUND', 'Domain not found');
  }

  return await db
    .delete(domainTable)
    .where(eq(domainTable.id, domainId))
    .returning();
}
