import { INVITE_EXPIRE_TIME_SPAN } from '@hexa/const';
import { generateId } from '@hexa/lib';
import { ApiError } from '@hexa/lib';
import {
  type CreateInvitesType,
  type InviteStatusType,
  type OrgInviteQueryType,
  type QueryInviteType,
  type SelectInviteType,
  transformSortParams,
} from '@hexa/server/schema/org-invite';
import type { OrgMemberRoleType } from '@hexa/server/schema/org-member';
import { emailTable } from '@hexa/server/table/email';
import { orgInviteTable } from '@hexa/server/table/org-invite';
import { orgMemberTable } from '@hexa/server/table/org-member';
import { userTable } from '@hexa/server/table/user';
import type { DbType } from '@hexa/server/types';
import { and, asc, desc, eq, gt, sql } from 'drizzle-orm';
// @ts-ignore
import { createDate } from 'oslo';
import { ZodError, type ZodIssue } from 'zod';

// Add this helper function to get all emails for org members
async function getOrgMemberEmails(db: DbType, orgId: string) {
  const emails = await db
    .select({
      email: emailTable.email,
    })
    .from(orgMemberTable)
    .leftJoin(userTable, eq(userTable.id, orgMemberTable.userId))
    .leftJoin(emailTable, eq(emailTable.userId, userTable.id))
    .where(
      and(eq(orgMemberTable.orgId, orgId), sql`${emailTable.email} IS NOT NULL`)
    );

  return emails.map((e) => e.email?.toLowerCase());
}

// Create new invites
export async function createInvites(
  db: DbType,
  data: { inviterId: string } & CreateInvitesType
) {
  // Get all member emails
  const memberEmails = await getOrgMemberEmails(db, data.orgId);

  // Check for existing members
  const existingMembers = data.invites.filter((invite) =>
    memberEmails.includes(invite.email.toLowerCase())
  );

  const issues: ZodIssue[] = [];

  if (existingMembers.length > 0) {
    const memberIssues: ZodIssue[] = existingMembers.map((invite) => {
      const index = data.invites.findIndex(
        (i) => i.email.toLowerCase() === invite.email.toLowerCase()
      );
      return {
        code: 'custom',
        message: `${invite.email} is already a member of this organization`,
        path: [`invites.${index}.email`],
      };
    });
    issues.push(...memberIssues);
  }

  // Check for pending invites (existing code)
  const existings = await db.query.orgInviteTable.findMany({
    where: and(
      eq(orgInviteTable.orgId, data.orgId),
      sql`${orgInviteTable.email} IN ${data.invites.map((invite) => invite.email)}`,
      eq(orgInviteTable.status, 'PENDING')
    ),
  });

  if (existings.length > 0) {
    const inviteIssues: ZodIssue[] = existings.map((invite) => {
      const index = data.invites.findIndex(
        (i) => i.email.toLowerCase() === invite.email.toLowerCase()
      );
      return {
        code: 'custom',
        message: `Invite already exists for ${invite.email}`,
        path: [`invites.${index}.email`],
      };
    });
    issues.push(...inviteIssues);
  }

  if (issues.length > 0) {
    throw new ZodError(issues);
  }

  // Create invite values with all fields we want to update
  const values = data.invites.map((invite) => ({
    ...invite,
    email: invite.email.toLowerCase(),
    orgId: data.orgId,
    inviterId: data.inviterId,
    createdAt: new Date(),
    expiresAt: createDate(INVITE_EXPIRE_TIME_SPAN),
    token: generateId(),
    status: 'PENDING' as InviteStatusType,
  }));

  const insertedInvites = await db
    .insert(orgInviteTable)
    .values(values)
    .onConflictDoUpdate({
      target: [orgInviteTable.orgId, orgInviteTable.email],
      set: {
        status: sql`excluded.status`,
        createdAt: sql`excluded.created_at`,
        expiresAt: sql`excluded.expires_at`,
        token: sql`excluded.token`,
        inviterId: sql`excluded.inviter_id`,
        role: sql`excluded.role`,
        name: sql`excluded.name`,
      },
    })
    .returning();

  return insertedInvites;
}

export async function revokeInvite(db: DbType, inviteId: string) {
  await db
    .update(orgInviteTable)
    .set({ status: 'REVOKED' })
    .where(eq(orgInviteTable.id, inviteId));
}

// Get invite by token
export async function getInviteByToken(
  db: DbType,
  token: string
): Promise<SelectInviteType> {
  const now = Math.floor(Date.now() / 1000); // Convert to seconds

  const invite = await db.query.orgInviteTable.findFirst({
    where: and(
      eq(orgInviteTable.token, token),
      eq(orgInviteTable.status, 'PENDING'),
      gt(orgInviteTable.expiresAt, sql`${now}`)
    ),
    with: {
      org: true,
      inviter: true,
    },
  });

  if (!invite) {
    throw new ApiError('NOT_FOUND', 'Invite is not valid or expired');
  }

  return {
    ...invite,
    createdAt: invite.createdAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
  };
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

// New function to get invites with details
export async function getInvitesByIds(
  db: DbType,
  inviteIds: string[]
): Promise<QueryInviteType[]> {
  const invites = await db.query.orgInviteTable.findMany({
    where: sql`${orgInviteTable.id} IN ${inviteIds}`,
    with: {
      org: true,
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
          oauthAccounts: {
            columns: {
              email: true,
            },
          },
        },
      },
    },
  });

  return invites.map((invite) => ({
    ...invite,
    createdAt: invite.createdAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
    inviter: {
      id: invite.inviter.id,
      name: invite.inviter.name,
      avatarUrl: invite.inviter.avatarUrl,
      email:
        invite.inviter.emails?.[0]?.email ??
        invite.inviter.oauthAccounts?.[0]?.email ??
        null,
    },
  }));
}

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
          oauthAccounts: {
            columns: {
              email: true,
            },
          },
        },
      },
    },
  });
  if (!invite) {
    throw new ApiError('NOT_FOUND', 'Invite not found');
  }

  return {
    ...invite,
    createdAt: invite.createdAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
  };
}

export const getOrgInvites = async (
  db: DbType,
  orgId: string,
  {
    filterStatus,
    filterRole,
    search,
    pageIndex,
    pageSize,
    ...sorting
  }: OrgInviteQueryType
): Promise<{ data: QueryInviteType[]; rowCount: number }> => {
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
      : [desc(orgInviteTable.expiresAt)];

  // Calculate offset
  const offset = pageIndex * pageSize;

  // Execute the paginated query with limit and offset
  const data = await db.query.orgInviteTable.findMany({
    with: {
      org: true,
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
          oauthAccounts: {
            columns: {
              email: true,
            },
          },
        },
      },
    },
    orderBy,
    limit: pageSize,
    offset: offset,
  });

  // Get total count using a separate count query
  const [result] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(orgInviteTable)
    .where(and(...conditions));

  const rowCount = Number(result?.count) ?? 0;

  // Transform the data as needed
  const transformedData: QueryInviteType[] = data.map((invite) => {
    return {
      ...invite,
      createdAt: invite.createdAt as unknown as string,
      expiresAt: invite.expiresAt as unknown as string,
      inviter: {
        id: invite.inviter.id,
        name: invite.inviter.name,
        avatarUrl: invite.inviter.avatarUrl,
        email:
          invite.inviter.emails?.[0]?.email ??
          invite.inviter.oauthAccounts?.[0]?.email ??
          null,
      },
    };
  });

  return {
    rowCount,
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

  // Update invite status
  await updateInviteStatus(db, token, 'ACCEPTED');

  // Add user to org
  await db
    .insert(orgMemberTable)
    .values({
      orgId: invite.orgId,
      userId,
      role: invite.role as OrgMemberRoleType,
    })
    .onConflictDoUpdate({
      target: [orgMemberTable.orgId, orgMemberTable.userId],
      set: {
        role: sql`excluded.role`,
      },
    });

  return invite;
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
