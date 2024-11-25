import { INVITE_EXPIRE_TIME_SPAN } from '@/lib/const';
import { generateId } from '@/lib/crypto';
import { ApiError } from '@/lib/error/error';
import type { PaginatedResult } from '@/lib/pagination';
import { paginateQuery } from '@/lib/pagination';
import type { DbType } from '@/server/route/route-types';
import {
  type CreateInvitesType,
  type InviteStatusType,
  type OrgInviteQueryType,
  type QueryInviteType,
  type SelectInviteType,
  transformSortParams,
} from '@/server/schema/org-invite';
import type { OrgMemberRoleType } from '@/server/schema/org-memeber';
import { emailTable } from '@/server/table/email';
import { orgInviteTable } from '@/server/table/org-invite';
import { orgMemberTable } from '@/server/table/org-member';
import type {} from '@tanstack/react-table';
import { and, asc, desc, eq, gt, sql } from 'drizzle-orm';
import { createDate } from 'oslo';
import { ZodError, type ZodIssue } from 'zod';

// Create new invites
export async function createInvites(
  db: DbType,
  data: { inviterId: string } & CreateInvitesType
) {
  // Check if invite already exists
  const existings = await db.query.orgInviteTable.findMany({
    where: and(
      eq(orgInviteTable.orgId, data.orgId),
      sql`${orgInviteTable.email} IN ${data.invites.map((invite) => invite.email)}`
    ),
  });

  if (existings.length > 0) {
    const issues: ZodIssue[] = existings.map((invite) => {
      const index = data.invites.findIndex(
        (i) => i.email.toLowerCase() === invite.email.toLowerCase()
      );
      return {
        code: 'custom',
        message: `Invite already exists for ${invite.email}`,
        path: [`invites.${index}.email`],
      };
    });
    throw new ZodError([
      ...issues,
      {
        code: 'custom',
        message: 'Please check the invites and try again',
        path: ['root'],
      },
    ]);
  }

  // Create invite
  const values = data.invites.map((invite) => ({
    ...invite,
    email: invite.email.toLowerCase(),
    orgId: data.orgId,
    inviterId: data.inviterId,
    expiresAt: createDate(INVITE_EXPIRE_TIME_SPAN),
    token: generateId(),
  }));
  const invites = await db
    .insert(orgInviteTable)
    .values(values)
    // .onConflictDoUpdate({
    //   target: [orgInviteTable.email],
    //   set: { expiresAt: sql`excluded.expiresAt` },
    // })
    .returning();
  return invites;
}

export async function revokeInvite(db: DbType, inviteId: string) {
  await db
    .update(orgInviteTable)
    .set({ status: 'REVOKED' })
    .where(eq(orgInviteTable.id, inviteId));
}

// Get invite by token
export async function getInviteByToken(db: DbType, token: string) {
  const invite = await db.query.orgInviteTable.findFirst({
    where: and(
      eq(orgInviteTable.token, token),
      eq(orgInviteTable.status, 'PENDING'),
      gt(orgInviteTable.expiresAt, new Date())
    ),
    with: {
      org: true,
      inviter: true,
    },
  });

  return invite;
}

// // Get org's invites
// export async function getOrgInvites(
//   db: DbType,
//   orgId: string,
//   status: InviteStatus[] = ['PENDING']
// ) {
//   const invites = await db.query.orgInviteTable.findMany({
//     where: and(
//       eq(orgInviteTable.orgId, orgId),
//       sql`${orgInviteTable.status} IN ${status}`
//     ),
//     with: {
//       inviter: true,
//     },
//     orderBy: (invite) => invite.expiresAt,
//   });

//   return invites;
// }

export async function getOrgInvite(
  db: DbType,
  { inviteId, orgId }: { inviteId: string; orgId: string }
): Promise<SelectInviteType> {
  const invite = await db.query.orgInviteTable.findFirst({
    where: and(
      eq(orgInviteTable.id, inviteId),
      eq(orgInviteTable.orgId, orgId)
    ),
    with: {
      org: true,
      inviter: {
        with: {
          orgMembers: {
            where: eq(orgMemberTable.orgId, orgInviteTable.orgId),
          },
        },
      },
    },
  });
  if (!invite) {
    throw new ApiError('NOT_FOUND', 'Invite not found');
  }

  if (!invite.inviter?.orgMembers[0]) {
    throw new ApiError('NOT_FOUND', 'Inviter not found');
  }

  return {
    ...invite,
    inviter: {
      ...invite.inviter,
      role: invite.inviter.orgMembers[0].role,
    },
  };
}

export const getOrgInvites = async (
  db: DbType,
  {
    orgId,
    pageIndex,
    pageSize,
    filterStatus,
    filterRole,
    search,
    ...sorting
  }: { orgId: string } & OrgInviteQueryType
): Promise<PaginatedResult<QueryInviteType>> => {
  // Start with base conditions
  const conditions = [eq(orgInviteTable.orgId, orgId)];

  if (filterStatus?.length) {
    // Add filter conditions
    conditions.push(sql`${orgInviteTable.status} IN ${filterStatus}`);
  }

  if (filterRole?.length) {
    conditions.push(sql`${orgInviteTable.role} IN ${filterRole}`);
  }

  if (search) {
    conditions.push(
      sql`(${orgInviteTable.email} LIKE ${`%${search}%`} OR 
          ${orgInviteTable.name} LIKE ${`%${search}%`})`
    );
  }
  const sortParams = transformSortParams(sorting);

  // Use sortParams in your DB query
  const orderBy =
    sortParams.length > 0
      ? sortParams.map(({ column, sort }) =>
          sort === 'desc'
            ? desc(orgInviteTable[column])
            : asc(orgInviteTable[column])
        )
      : [desc(orgInviteTable.createdAt)];

  const baseQuery = {
    where: and(...conditions),
    with: {
      inviter: {
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
    orderBy,
  };

  const result = await paginateQuery<QueryInviteType>(db, baseQuery, {
    pageIndex,
    pageSize,
  });

  // Transform the data as needed
  const transformedData = result.data.map((invite) => ({
    ...invite,
    createdAt: invite.createdAt as unknown as string,
    expiresAt: invite.expiresAt as unknown as string,
    inviter: {
      id: invite.inviter.id,
      name: invite.inviter.name,
      avatarUrl: invite.inviter.avatarUrl,
      // @ts-ignore
      email: invite.inviter.emails?.[0]?.email ?? null,
    },
  }));

  return {
    ...result,
    data: transformedData,
  };
};

// Update invite status
export async function updateInviteStatus(
  db: DbType,
  token: string,
  status: InviteStatusType
) {
  const [invite] = await db
    .update(orgInviteTable)
    .set({ status })
    .where(eq(orgInviteTable.token, token))
    .returning();

  return invite;
}

// Accept invite
export async function acceptInvite(db: DbType, token: string, userId: string) {
  const invite = await getInviteByToken(db, token);

  if (!invite) {
    throw new ApiError('NOT_FOUND', 'Invalid or expired invite');
  }

  // Add user to org
  await db.insert(orgMemberTable).values({
    orgId: invite.orgId,
    userId,
    role: invite.role as OrgMemberRoleType,
  });

  // Update invite status
  return await updateInviteStatus(db, token, 'ACCEPTED');
}

// Delete expired invites
export async function deleteExpiredInvites(db: DbType) {
  await db
    .delete(orgInviteTable)
    .where(
      sql`${orgInviteTable.status} = 'PENDING' AND ${orgInviteTable.expiresAt} < datetime('now')`
    );
}

// Delete invite
export async function deleteInvite(db: DbType, token: string) {
  const [invite] = await db
    .delete(orgInviteTable)
    .where(eq(orgInviteTable.token, token))
    .returning();

  return invite;
}
