import { ApiError } from '@/lib/error/error';
import type { DbType } from '@/server/route/route-types';
import { transformSortParams } from '@/server/schema/url';
import type {
  InsertUrlType,
  SelectUrlType,
  UrlQueryType,
} from '@/server/schema/url';
import { urlTable } from '@/server/table/url';
import { and, asc, desc, eq, sql } from 'drizzle-orm';

// Get all URLs in a project
export async function getUrls(
  db: DbType,
  projectId: string,
  { filterDomain, search, pageIndex, pageSize, ...sorting }: UrlQueryType
): Promise<{ rowCount: number; data: SelectUrlType[] }> {
  // Start with base conditions
  const conditions = [eq(urlTable.projectId, projectId)];

  if (filterDomain?.length) {
    // Add filter conditions
    conditions.push(sql`${urlTable.domain} IN ${filterDomain}`);
  }

  if (search) {
    conditions.push(
      sql`(${urlTable.domain} LIKE ${`%${search}%`} OR 
          ${urlTable.destUrl} LIKE ${`%${search}%`}) OR 
          ${urlTable.slug} LIKE ${`%${search}%`} OR 
          ${urlTable.title} LIKE ${`%${search}%`})`
    );
  }
  const sortParams = transformSortParams(sorting);

  // Use sortParams in your DB query
  const orderBy =
    sortParams.length > 0
      ? sortParams.map(({ column, sort }) =>
          sort === 'desc' ? desc(urlTable[column]) : asc(urlTable[column])
        )
      : [desc(urlTable.createdAt)];

  // Calculate offset
  const offset = pageIndex * pageSize;

  // Execute the paginated query with limit and offset
  const data = await db.query.urlTable.findMany({
    // with: {
    //   project: true,
    // },
    where: and(...conditions),
    orderBy,
    limit: pageSize,
    offset: offset,
  });

  // Get total count using a separate count query
  const [result] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(urlTable)
    .where(and(...conditions));

  const rowCount = Number(result?.count) ?? 0;

  // Transform the data as needed
  const transformedData: SelectUrlType[] = data.map((url) => {
    return {
      ...url,
      createdAt: url.createdAt as unknown as string,
    };
  });

  return {
    rowCount,
    data: transformedData,
  };
}

// Create a new short URL
export async function createUrl(db: DbType, data: InsertUrlType) {
  // Create new URL
  const [url] = await db.insert(urlTable).values(data).returning();

  return url;
}

// Get URL by ID
export async function getUrlById(db: DbType, urlId: string) {
  const url = await db.query.urlTable.findFirst({
    where: eq(urlTable.id, urlId),
    with: {
      project: {
        with: {
          org: true,
        },
      },
    },
  });

  return url;
}

// Update URL
export async function updateUrl(
  db: DbType,
  data: Partial<InsertUrlType> & { id: string }
) {
  const [updated] = await db
    .update(urlTable)
    .set(data)
    .where(eq(urlTable.id, data.id))
    .returning();

  if (!updated) {
    throw new ApiError('NOT_FOUND', 'URL not found');
  }

  return updated;
}

// Delete URL
export async function deleteUrl(db: DbType, urlId: string) {
  const [deleted] = await db
    .delete(urlTable)
    .where(eq(urlTable.id, urlId))
    .returning();

  if (!deleted) {
    throw new ApiError('NOT_FOUND', 'URL not found');
  }

  return deleted;
}
