import type { DbType } from '@/server/route/route-types';
import { orgInviteTable } from '@/server/table/org-invite';
import { sql } from 'drizzle-orm';

export interface PaginationMetadata {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: PaginationMetadata;
}

export async function paginateQuery<T>(
  db: DbType,
  baseQuery: Parameters<typeof db.query.orgInviteTable.findMany>[0],
  { pageIndex, pageSize }: { pageIndex: number; pageSize: number }
): Promise<PaginatedResult<T>> {
  // Calculate offset
  const offset = pageIndex * pageSize;

  // Execute the paginated query with limit and offset
  const data = await db.query.orgInviteTable.findMany({
    ...baseQuery,
    limit: pageSize,
    offset: offset,
  });

  // Get total count using a separate count query
  const [result] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(orgInviteTable)
    // @ts-expect-error
    .where(baseQuery.where);

  // @ts-expect-error
  const totalCount = Number(result.count);
  const pageCount = Math.ceil(totalCount / pageSize);

  return {
    data: data as T[],
    metadata: {
      totalCount,
      pageCount,
      currentPage: pageIndex,
      pageSize,
      hasNextPage: pageIndex < pageCount - 1,
      hasPreviousPage: pageIndex > 0,
    },
  };
}
