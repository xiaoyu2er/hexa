import type { InsertShortUrlType } from '@/features/url/schema';
import { urlTable } from '@/features/url/table';
import { ApiError } from '@/lib/error/error';
import type { DbType } from '@/lib/route-types';
import { and, eq, or, sql } from 'drizzle-orm';

// Create a new short URL
export async function createShortUrl(db: DbType, data: InsertShortUrlType) {
  // Check if slug is already taken in this workspace
  const existing = await db.query.urlTable.findFirst({
    where: and(
      eq(urlTable.projectId, data.projectId),
      eq(urlTable.slug, data.slug)
    ),
  });

  if (existing) {
    throw new ApiError('CONFLICT', 'URL slug already exists in this workspace');
  }

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

// Get URL by workspace ID and slug
export async function getUrlBySlug(
  db: DbType,
  projectId: string,
  slug: string
) {
  const url = await db.query.urlTable.findFirst({
    where: and(eq(urlTable.projectId, projectId), eq(urlTable.slug, slug)),
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

// Get all URLs in a workspace
export async function getProjectUrls(
  db: DbType,
  projectId: string,
  options: {
    limit?: number;
    offset?: number;
  } = {}
) {
  const urls = await db.query.urlTable.findMany({
    where: eq(urlTable.projectId, projectId),
    with: {
      project: {
        with: {
          org: true,
        },
      },
    },
    limit: options.limit,
    offset: options.offset,
  });

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(urlTable)
    .where(eq(urlTable.projectId, projectId));

  return {
    data: urls,
    total: total[0]?.count ?? 0,
  };
}

// Update URL
export async function updateUrl(
  db: DbType,
  urlId: string,
  data: Partial<InsertShortUrlType>
) {
  // If updating slug, check it's not taken
  if (data.slug) {
    const existing = await db.query.urlTable.findFirst({
      where: eq(urlTable.slug, data.slug),
    });

    if (existing && existing.id !== urlId) {
      throw new ApiError('CONFLICT', 'URL slug already exists');
    }
  }

  const [updated] = await db
    .update(urlTable)
    .set(data)
    .where(eq(urlTable.id, urlId))
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

// Search URLs in workspace
export async function searchProjectUrls(
  db: DbType,
  projectId: string,
  query: string,
  options: {
    limit?: number;
    offset?: number;
  } = {}
) {
  const urls = await db.query.urlTable.findMany({
    where: and(
      eq(urlTable.projectId, projectId),
      or(
        sql`${urlTable.slug} LIKE ${`%${query}%`}`,
        sql`${urlTable.title} LIKE ${`%${query}%`}`,
        sql`${urlTable.desc} LIKE ${`%${query}%`}`,
        sql`${urlTable.destUrl} LIKE ${`%${query}%`}`
      )
    ),
    with: {
      project: {
        with: {
          org: true,
        },
      },
    },
    limit: options.limit,
    offset: options.offset,
  });

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(urlTable)
    .where(
      and(
        eq(urlTable.projectId, projectId),
        or(
          sql`${urlTable.slug} LIKE ${`%${query}%`}`,
          sql`${urlTable.title} LIKE ${`%${query}%`}`,
          sql`${urlTable.desc} LIKE ${`%${query}%`}`,
          sql`${urlTable.destUrl} LIKE ${`%${query}%`}`
        )
      )
    );

  return {
    data: urls,
    total: total[0]?.count ?? 0,
  };
}
