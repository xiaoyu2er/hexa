import { INVITE_EXPIRE_TIME_SPAN } from '@/lib/const';
import { generateId } from '@/lib/crypto';
import { ApiError } from '@/lib/error/error';
import type { DbType } from '@/server/route/route-types';
import type {
  CreateInvitesType,
  InviteStatusType,
  SelectInviteType,
} from '@/server/schema/org-invite';
import type { OrgMemberRoleType } from '@/server/schema/org-memeber';
import { emailTable } from '@/server/table/email';
import { orgInviteTable } from '@/server/table/org-invite';
import { orgMemberTable } from '@/server/table/org-member';
import { userTable } from '@/server/table/user';
import { and, eq, gt, sql } from 'drizzle-orm';
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
        message: 'Invite already exists for this email',
        path: [`invites.${index}.email`],
      };
    });
    throw new ZodError(issues);
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
    .onConflictDoUpdate({
      target: [orgInviteTable.email],
      set: { expiresAt: sql`excluded.expiresAt` },
    })
    .returning();
  return invites;
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

// Get org invites
export const getOrgInvites = async (
  db: DbType,
  orgId: string
): Promise<{ data: SelectInviteType[]; rowCount: number }> => {
  const invites = await db.query.orgInviteTable.findMany({
    where: eq(orgInviteTable.orgId, orgId),
    with: {
      inviter: {
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

  const data = invites.map((invite) => ({
    ...invite,
    createdAt: invite.createdAt as unknown as string,
    expiresAt: invite.expiresAt as unknown as string,
    inviter: {
      id: invite.inviter.id,
      name: invite.inviter.name,
      avatarUrl: invite.inviter.avatarUrl,
      email: invite.inviter.emails[0]?.email ?? null,
    },
  }));

  return {
    data,
    rowCount: data.length,
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
