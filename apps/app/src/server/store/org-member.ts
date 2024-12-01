import type { DbType } from '@/server/route/route-types';
import {
  type OrgMemberQueryType,
  isDirectTableColumn,
  transformSortParams,
} from '@/server/schema/org-member';
import type { SelectOrgMemberType } from '@/server/schema/org-member';
import { emailTable } from '@/server/table/email';
import { orgMemberTable } from '@/server/table/org-member';
import { userTable } from '@/server/table/user';
import { and, asc, desc, eq, sql } from 'drizzle-orm';

export const getOrgMember = async (
  db: DbType,
  orgId: string,
  userId: string
) => {
  return db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, userId)
    ),
  });
};

// Get org members
export const getOrgMembers = async (
  db: DbType,
  orgId: string,
  { pageIndex, pageSize, filterRole, search, ...sorting }: OrgMemberQueryType
): Promise<{ data: SelectOrgMemberType[]; rowCount: number }> => {
  const conditions = [eq(orgMemberTable.orgId, orgId)];

  if (filterRole?.length) {
    conditions.push(sql`${orgMemberTable.role} IN ${filterRole}`);
  }

  if (search) {
    conditions.push(
      sql`(${userTable.name} LIKE ${`%${search}%`} OR 
          ${emailTable.email} LIKE ${`%${search}%`})`
    );
  }

  const sortItems = transformSortParams(sorting);
  const orderBy = sortItems.map(({ column, sort }) => {
    switch (column) {
      // case 'name':
      //   return sort === 'desc' ? desc(userTable.name) : asc(userTable.name);
      // case 'email':
      //   return sort === 'desc' ? desc(emailTable.email) : asc(emailTable.email);
      default: {
        if (isDirectTableColumn(column)) {
          return sort === 'desc'
            ? desc(orgMemberTable[column])
            : asc(orgMemberTable[column]);
        }
        return desc(orgMemberTable.createdAt);
      }
    }
  });

  const baseQuery = {
    where: and(...conditions),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatarUrl: true,
        },
        with: {
          emails: {
            where: and(eq(emailTable.primary, true)),
            limit: 1,
          },
        },
      },
    },
    orderBy: orderBy.length > 0 ? orderBy : [desc(orgMemberTable.createdAt)],
  } as const;

  const offset = pageIndex * pageSize;

  // Execute the paginated query with limit and offset
  const data = await db.query.orgMemberTable.findMany({
    ...baseQuery,
    limit: pageSize,
    offset: offset,
  });

  // Get total count using a separate count query
  const [result] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(orgMemberTable)
    .where(baseQuery.where);

  const rowCount = Number(result?.count) ?? 0;

  // Transform the data
  const transformedData: SelectOrgMemberType[] = data.map((member) => ({
    id: member.id,
    orgId: member.orgId,
    role: member.role,
    createdAt: member.createdAt as unknown as string,
    user: {
      id: member.user.id,
      name: member.user.name,
      avatarUrl: member.user.avatarUrl,
      email: member.user.emails[0]?.email ?? null,
    },
    userId: member.user.id,
  }));

  return {
    rowCount,
    data: transformedData,
  };
};
