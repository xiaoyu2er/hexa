import { ApiError } from '@hexa/lib';
import { isUniqueConstraintViolationError } from '@hexa/server/lib/error';
import type { DbType } from '@hexa/server/route/route-types';
import type { InsertOrgType, SelectUserOrgType } from '@hexa/server/schema/org';
import type {
  InsertOrgMemberType,
  OrgMemberRoleType,
} from '@hexa/server/schema/org-member';
import { orgTable } from '@hexa/server/table/org';
import { orgMemberTable } from '@hexa/server/table/org-member';
import { and, eq, sql } from 'drizzle-orm';

// 1. List all orgs that user belongs to with roles
export const getUserOrgs = async (
  db: DbType,
  userId: string
): Promise<{ data: SelectUserOrgType[]; rowCount: number }> => {
  const rows = (
    await db.query.orgMemberTable.findMany({
      where: eq(orgMemberTable.userId, userId),
      with: {
        org: true,
      },
    })
  ).map((member) => {
    return {
      ...member.org,
      role: member.role,
    };
  });

  return {
    data: rows,
    rowCount: rows.length,
  };
};

// 2. Transfer ownership to another user
export const transferOrgOwnership = async (
  db: DbType,
  {
    orgId,
    currentOwnerId,
    newOwnerId,
  }: {
    orgId: string;
    currentOwnerId: string;
    newOwnerId: string;
  }
) => {
  // Verify current user is owner
  const currentOwner = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, currentOwnerId),
      eq(orgMemberTable.role, 'OWNER')
    ),
  });

  if (!currentOwner) {
    throw new ApiError(
      'FORBIDDEN',
      'Only the organization owner can transfer ownership'
    );
  }

  // Verify new owner exists in org
  const newOwnerMember = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, newOwnerId)
    ),
  });

  if (!newOwnerMember) {
    throw new ApiError(
      'NOT_FOUND',
      'New owner must be a member of the organization'
    );
  }

  // Update new owner first to ensure there's always an owner
  await db
    .update(orgMemberTable)
    .set({ role: 'OWNER' })
    .where(
      and(
        eq(orgMemberTable.orgId, orgId),
        eq(orgMemberTable.userId, newOwnerId)
      )
    );

  // Update current owner to admin
  await db
    .update(orgMemberTable)
    .set({ role: 'ADMIN' })
    .where(
      and(
        eq(orgMemberTable.orgId, orgId),
        eq(orgMemberTable.userId, currentOwnerId)
      )
    );

  return true;
};

// Leave organization
export const leaveOrg = async (
  db: DbType,
  { orgId, userId }: { orgId: string; userId: string }
) => {
  // Check if user is member
  const member = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, userId)
    ),
  });

  if (!member) {
    throw new ApiError(
      'NOT_FOUND',
      'User is not a member of this organization'
    );
  }

  // If member is owner, check if there are other owners
  if (member.role === 'OWNER') {
    const otherOwnersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orgMemberTable)
      .where(
        and(
          eq(orgMemberTable.orgId, orgId),
          eq(orgMemberTable.role, 'OWNER'),
          sql`${orgMemberTable.userId} != ${userId}`
        )
      )
      .then((result) => Number(result[0]?.count ?? 0));

    if (otherOwnersCount === 0) {
      throw new ApiError(
        'FORBIDDEN',
        'Cannot leave organization as the only owner - transfer ownership first'
      );
    }
  }

  // Remove user from org
  await db
    .delete(orgMemberTable)
    .where(
      and(eq(orgMemberTable.orgId, orgId), eq(orgMemberTable.userId, userId))
    );

  return true;
};

// 4. Update member role
// Owner can update member role to ADMIN or MEMBER
// Admin can update member role to ADMIN if target user is not owner but can't update admin role to member
// MEMBER cannot update any roles
export const updateOrgMemberRole = async (
  db: DbType,
  {
    orgId,
    targetUserId,
    newRole,
    currentUserId,
  }: {
    orgId: string;
    targetUserId: string;
    newRole: Exclude<OrgMemberRoleType, 'OWNER'>; // Can't set someone as owner this way
    currentUserId: string;
  }
) => {
  // Get current user's role
  const currentUserMember = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, currentUserId)
    ),
  });

  if (!currentUserMember) {
    throw new ApiError(
      'FORBIDDEN',
      'You must be a member of the organization to modify roles'
    );
  }

  // Verify target user exists in org
  const targetMember = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, targetUserId)
    ),
  });

  if (!targetMember) {
    throw new ApiError(
      'NOT_FOUND',
      'User is not a member of this organization'
    );
  }

  // Don't allow modifying the role of the owner
  if (targetMember.role === 'OWNER') {
    throw new ApiError(
      'FORBIDDEN',
      'Cannot modify the role of the organization owner'
    );
  }

  // Check permissions based on current user's role
  if (currentUserMember.role === 'OWNER') {
    // Owner can set any role except OWNER (handled by type)
  } else if (currentUserMember.role === 'ADMIN') {
    // Admin can only promote members to admin
    if (targetMember.role === 'ADMIN' || newRole === 'MEMBER') {
      throw new ApiError(
        'FORBIDDEN',
        'Admins cannot modify other admin roles or demote to member'
      );
    }
    if (newRole !== 'ADMIN') {
      throw new ApiError(
        'FORBIDDEN',
        'Admins can only promote members to admin role'
      );
    }
  } else {
    // Members cannot modify roles
    throw new ApiError(
      'FORBIDDEN',
      'Regular members cannot modify organization roles'
    );
  }

  // Update member role
  await db
    .update(orgMemberTable)
    .set({ role: newRole })
    .where(
      and(
        eq(orgMemberTable.orgId, orgId),
        eq(orgMemberTable.userId, targetUserId)
      )
    );

  return true;
};

// Helper function to check if user has required role
export const assertUserHasOrgRole = async (
  db: DbType,
  {
    orgId,
    userId,
    requiredRole,
  }: {
    orgId: string;
    userId: string;
    requiredRole: OrgMemberRoleType[];
  }
) => {
  const member = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, userId)
    ),
  });

  if (!member || !requiredRole.includes(member.role)) {
    throw new ApiError(
      'FORBIDDEN',
      'User does not have the required role for this action'
    );
  }

  return member;
};

export const addOrgMember = async (
  db: DbType,
  {
    orgId,
    targetUserId,
    role,
    currentUserId,
  }: {
    orgId: string;
    targetUserId: string;
    role: Exclude<OrgMemberRoleType, 'OWNER'>; // Can't add someone as owner directly
    currentUserId: string;
  }
) => {
  // Get current user's role
  const currentUserMember = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, currentUserId)
    ),
  });

  if (!currentUserMember) {
    throw new ApiError(
      'FORBIDDEN',
      'You must be a member of the organization to add members'
    );
  }

  // Check if target user is already a member
  const existingMember = await db.query.orgMemberTable.findFirst({
    where: and(
      eq(orgMemberTable.orgId, orgId),
      eq(orgMemberTable.userId, targetUserId)
    ),
  });

  if (existingMember) {
    throw new ApiError(
      'CONFLICT',
      'User is already a member of this organization'
    );
  }

  // Check permissions based on current user's role
  if (currentUserMember.role === 'OWNER') {
    // Owner can add members with any role except OWNER (handled by type)
  } else if (currentUserMember.role === 'ADMIN') {
    // Admin can only add members with MEMBER role
    if (role !== 'MEMBER') {
      throw new ApiError(
        'FORBIDDEN',
        'Admins can only add members with MEMBER role'
      );
    }
  } else {
    // Regular members cannot add new members
    throw new ApiError(
      'FORBIDDEN',
      'Regular members cannot add new members to the organization'
    );
  }

  // Add new member
  await db.insert(orgMemberTable).values({
    orgId,
    userId: targetUserId,
    role,
  });

  return true;
};

// Create organization and add creator as owner
export const createOrg = async (
  db: DbType,
  { name, slug, userId }: InsertOrgType & Pick<InsertOrgMemberType, 'userId'>
) => {
  try {
    // Create org
    const [org] = await db.insert(orgTable).values({ name, slug }).returning();

    if (!org) {
      throw new ApiError(
        'INTERNAL_SERVER_ERROR',
        'Failed to create organization'
      );
    }

    // Add creator as owner
    await db.insert(orgMemberTable).values({
      orgId: org.id,
      userId,
      role: 'OWNER',
    });

    return org;
  } catch (error) {
    // Check if error is a unique constraint violation
    if (isUniqueConstraintViolationError(error)) {
      throw new ApiError(
        'CONFLICT',
        'An organization with this slug already exists'
      );
    }
    // Re-throw other errors
    throw error;
  }
};

// Update organization
export const updateOrg = async (
  db: DbType,
  orgId: string,
  data: Partial<InsertOrgType>
) => {
  const [updatedOrg] = await db
    .update(orgTable)
    .set(data)
    .where(eq(orgTable.id, orgId))
    .returning();

  if (!updatedOrg) {
    throw new ApiError('NOT_FOUND', 'Organization not found');
  }

  return updatedOrg;
};

// Delete organization
export const deleteOrg = async (db: DbType, orgId: string) => {
  const [deletedOrg] = await db
    .delete(orgTable)
    .where(eq(orgTable.id, orgId))
    .returning();

  if (!deletedOrg) {
    throw new ApiError('NOT_FOUND', 'Organization not found');
  }

  return deletedOrg;
};

// Get org by name and check if userId is a member
export const getOrgWithUserRole = async (
  db: DbType,
  orgId: string,
  userId: string
) => {
  const org = await db.query.orgTable.findFirst({
    where: eq(orgTable.id, orgId),
    with: {
      members: {
        where: eq(orgMemberTable.userId, userId),
      },
    },
  });

  if (!org) {
    return null;
  }

  return {
    ...org,
    role: org.members[0]?.role ?? null,
  };
};

// Update org name
export const updateOrgName = async (
  db: DbType,
  { orgId, userId, name }: { orgId: string; userId: string; name: string }
) => {
  // Check if user is owner
  await assertUserHasOrgRole(db, {
    orgId,
    userId,
    requiredRole: ['OWNER', 'ADMIN'],
  });

  const [updatedOrg] = await db
    .update(orgTable)
    .set({ name })
    .where(eq(orgTable.id, orgId))
    .returning();

  return updatedOrg;
};

// Update org slug
export const updateOrgSlug = async (
  db: DbType,
  { orgId, slug }: { orgId: string; slug: string }
) => {
  const [updatedOrg] = await db
    .update(orgTable)
    .set({ slug })
    .where(eq(orgTable.id, orgId))
    .returning();

  return updatedOrg;
};

// Update org avatar
export async function updateOrgAvatar(
  db: DbType,
  {
    orgId,
    avatarUrl,
  }: {
    orgId: string;
    avatarUrl: string;
  }
) {
  return (
    await db
      .update(orgTable)
      .set({ avatarUrl })
      .where(eq(orgTable.id, orgId))
      .returning()
  )[0];
}
