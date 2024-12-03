import { ApiError } from '@/lib/error/error';
import type { DbType } from '@/server/route/route-types';
import { transformSortParams } from '@/server/schema/link';
import type {
  InsertLinkType,
  LinkQueryType,
  SelectLinkType,
} from '@/server/schema/link';
import { linkTable } from '@/server/table/link';
import { and, asc, desc, eq, sql } from 'drizzle-orm';

// Get all URLs in a project
export async function getLinks(
  db: DbType,
  projectId: string,
  { filterDomain, search, pageIndex, pageSize, ...sorting }: LinkQueryType
): Promise<{ rowCount: number; data: SelectLinkType[] }> {
  // Start with base conditions
  const conditions = [eq(linkTable.projectId, projectId)];

  if (filterDomain?.length) {
    // Add filter conditions
    conditions.push(sql`${linkTable.domain} IN ${filterDomain}`);
  }

  if (search) {
    conditions.push(
      sql`(${linkTable.domain} LIKE ${`%${search}%`} OR 
          ${linkTable.destUrl} LIKE ${`%${search}%`}) OR 
          ${linkTable.slug} LIKE ${`%${search}%`} OR 
          ${linkTable.title} LIKE ${`%${search}%`})`
    );
  }
  const sortParams = transformSortParams(sorting);

  // Use sortParams in your DB query
  const orderBy =
    sortParams.length > 0
      ? sortParams.map(({ column, sort }) =>
          sort === 'desc' ? desc(linkTable[column]) : asc(linkTable[column])
        )
      : [desc(linkTable.createdAt)];

  // Calculate offset
  const offset = pageIndex * pageSize;

  // Execute the paginated query with limit and offset
  const data = await db.query.linkTable.findMany({
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
    .from(linkTable)
    .where(and(...conditions));

  const rowCount = Number(result?.count) ?? 0;

  // Transform the data as needed
  const transformedData: SelectLinkType[] = data.map((url) => {
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
export async function createLink(db: DbType, data: InsertLinkType) {
  // Create new URL
  const [link] = await db.insert(linkTable).values(data).returning();
  return link;
}

// Get URL by ID
export async function getUrlById(db: DbType, urlId: string) {
  const url = await db.query.linkTable.findFirst({
    where: eq(linkTable.id, urlId),
    with: {
      project: true,
    },
  });

  return url;
}

// Update URL
export async function updateUrl(
  db: DbType,
  data: Partial<InsertLinkType> & { id: string }
) {
  const [updated] = await db
    .update(linkTable)
    .set(data)
    .where(eq(linkTable.id, data.id))
    .returning();

  if (!updated) {
    throw new ApiError('NOT_FOUND', 'URL not found');
  }

  return updated;
}

// Delete URL
export async function deleteUrl(db: DbType, urlId: string) {
  const [deleted] = await db
    .delete(linkTable)
    .where(eq(linkTable.id, urlId))
    .returning();

  if (!deleted) {
    throw new ApiError('NOT_FOUND', 'URL not found');
  }

  return deleted;
}
