import type { DbType } from '@/server/route/route-types';
import type { SelectOrgMemberType } from '@/server/schema/org-memeber';
import { emailTable } from '@/server/table/email';
import { orgMemberTable } from '@/server/table/org-member';
import { userTable } from '@/server/table/user';
import { and, eq } from 'drizzle-orm';

// Get org members
export const getOrgMembers = async (
  db: DbType,
  orgId: string
): Promise<{ data: SelectOrgMemberType[]; rowCount: number }> => {
  const members = await db.query.orgMemberTable.findMany({
    where: eq(orgMemberTable.orgId, orgId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatarUrl: true,
        },
        with: {
          emails: {
            where: and(
              eq(emailTable.userId, userTable.id),
              eq(emailTable.primary, true)
            ),
            limit: 1,
          },
        },
      },
    },
  });

  const data = members.map((member) => ({
    ...member,
    createdAt: member.createdAt as unknown as string,
    user: {
      id: member.user.id,
      name: member.user.name,
      avatarUrl: member.user.avatarUrl,
      email: member.user.emails[0]?.email ?? null,
    },
  }));

  return {
    data,
    rowCount: members.length,
  };
};
