import type { InsertInviteType, InviteStatus } from '@/features/invite/schema';
import { inviteTable } from '@/features/invite/table';
import type { OrgMemberRole } from '@/features/org-member/schema';
import { orgMemberTable } from '@/features/org-member/table';
import { INVITE_EXPIRE_TIME_SPAN } from '@/lib/const';
import { ApiError } from '@/lib/error/error';
import type { DbType } from '@/lib/route-types';
import { and, eq, gt, sql } from 'drizzle-orm';
import { createDate } from 'oslo';

// Create new invite
export async function createInvite(db: DbType, data: InsertInviteType) {
  // Check if invite already exists
  const existing = await db.query.inviteTable.findFirst({
    where: and(
      eq(inviteTable.orgId, data.orgId),
      eq(inviteTable.email, data.email.toLowerCase())
    ),
  });

  if (existing) {
    throw new ApiError('CONFLICT', 'Invite already exists for this email');
  }

  // Create invite
  const [invite] = await db
    .insert(inviteTable)
    .values({
      ...data,
      email: data.email.toLowerCase(),
      expiresAt: createDate(INVITE_EXPIRE_TIME_SPAN),
    })
    .returning();

  return invite;
}

// Get invite by token
export async function getInviteByToken(db: DbType, token: string) {
  const invite = await db.query.inviteTable.findFirst({
    where: and(
      eq(inviteTable.token, token),
      eq(inviteTable.status, 'PENDING'),
      gt(inviteTable.expiresAt, new Date())
    ),
    with: {
      org: true,
      inviter: true,
    },
  });

  return invite;
}

// Get org's invites
export async function getOrgInvites(
  db: DbType,
  orgId: string,
  status: InviteStatus[] = ['PENDING']
) {
  const invites = await db.query.inviteTable.findMany({
    where: and(
      eq(inviteTable.orgId, orgId),
      sql`${inviteTable.status} IN ${status}`
    ),
    with: {
      inviter: true,
    },
    orderBy: (invite) => invite.expiresAt,
  });

  return invites;
}

// Update invite status
export async function updateInviteStatus(
  db: DbType,
  token: string,
  status: InviteStatus
) {
  const [invite] = await db
    .update(inviteTable)
    .set({ status })
    .where(eq(inviteTable.token, token))
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
    role: invite.role as OrgMemberRole,
  });

  // Update invite status
  return await updateInviteStatus(db, token, 'ACCEPTED');
}

// Delete expired invites
export async function deleteExpiredInvites(db: DbType) {
  await db
    .delete(inviteTable)
    .where(
      sql`${inviteTable.status} = 'PENDING' AND ${inviteTable.expiresAt} < datetime('now')`
    );
}

// Delete invite
export async function deleteInvite(db: DbType, token: string) {
  const [invite] = await db
    .delete(inviteTable)
    .where(eq(inviteTable.token, token))
    .returning();

  return invite;
}
