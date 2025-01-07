import { ApiError } from '@hexa/lib';
import type { DbType } from '@hexa/server/route/route-types';
import { transformSortParams } from '@hexa/server/schema/tag';
import type {
  InsertTagType,
  TagQueryType,
  SelectTagType,
	UpdateTagType,
} from '@hexa/server/schema/tag';
import { tagTable } from '@hexa/server/table/tag';
import { and, asc, desc, eq, sql } from 'drizzle-orm';

// Get all tags in a project
export async function getTags(
  db: DbType,
  projectId: string,
  { search, pageIndex, pageSize, ...sorting }: TagQueryType
): Promise<{ rowCount: number; data: SelectTagType[] }> {
  // Start with base conditions
  const conditions = [eq(tagTable.projectId, projectId)];

  if (search) {
    conditions.push(
      sql`(${tagTable.name} LIKE ${`%${search}%`})`
    );
  }
  const sortParams = transformSortParams(sorting);

  // Use sortParams in your DB query
  const orderBy =
    sortParams.length > 0
      ? sortParams.map(({ column, sort }) =>
          sort === 'desc' ? desc(tagTable[column]) : asc(tagTable[column])
        )
      : [desc(tagTable.createdAt)];

  // Calculate offset
  const offset = pageIndex * pageSize;

  // Execute the paginated query with limit and offset
  const data = await db.query.tagTable.findMany({
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
    .from(tagTable)
    .where(and(...conditions));

  const rowCount = Number(result?.count) ?? 0;

  // Transform the data as needed
  const transformedData: SelectTagType[] = data.map((url) => {
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
// Get Tag by ID
export async function getTagById(db: DbType, tagId: string) {
  const tag = await db.query.tagTable.findFirst({
    where: eq(tagTable.id, tagId),
    with: {
      project: true,
    },
  });

  return tag;
}
// Create a new tag
export async function createTag(db: DbType, data: InsertTagType) {
  // Create new tag
  const [tag] = await db.insert(tagTable).values(data).returning();
  return tag;
}

// Update Tag
export async function updateTag(
  db: DbType,
  data: UpdateTagType
) {
  const [updated] = await db
    .update(tagTable)
    .set(data)
    .where(eq(tagTable.id, data.id))
    .returning();

  if (!updated) {
    throw new ApiError('NOT_FOUND', 'TAG not found');
  }

  return updated;
}

// Delete Tag
export async function deleteTag(db: DbType, tagId: string) {
  const [deleted] = await db
    .delete(tagTable)
    .where(eq(tagTable.id, tagId))
    .returning();

  if (!deleted) {
    throw new ApiError('NOT_FOUND', 'TAG not found');
  }

  return deleted;
}
