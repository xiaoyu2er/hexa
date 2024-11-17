import { ApiError } from '@/lib/error/error';
import { and, eq, exists, or, sql } from 'drizzle-orm';
import {
  type InsertWorkspaceType,
  orgMemberTable,
  orgTable,
  userTable,
  workspaceOwnerTable,
  workspaceTable,
} from '../db/schema';
import type { DbType } from '../types';

// Helper function to get workspace with owner info
async function getWorkspaceWithOwner(db: DbType, wsId: string) {
  const workspace = await db.query.workspaceTable.findFirst({
    where: eq(workspaceTable.id, wsId),
    with: {
      owner: {
        with: {
          user: true,
          org: true,
        },
      },
    },
  });

  if (!workspace) {
    throw new ApiError('NOT_FOUND', 'Workspace not found');
  }

  const owner = workspace.owner.user ?? workspace.owner.org;
  if (!owner) {
    throw new ApiError('NOT_FOUND', 'Workspace owner not found');
  }

  return {
    ...workspace,
  };
}

// Helper function to get workspace select query builder
function getWorkspaceSelectBuilder(db: DbType) {
  return db
    .select({
      id: workspaceTable.id,
      name: workspaceTable.name,
      desc: workspaceTable.desc,
      avatarUrl: workspaceTable.avatarUrl,
      // createdAt: workspaceTable.createdAt,
      owner: {
        ownerId: sql<string>`
          CASE 
            WHEN ${workspaceOwnerTable.ownerType} = 'USER' 
            THEN ${workspaceOwnerTable.userId}
            ELSE ${workspaceOwnerTable.orgId}
          END
        `.as('ownerId'),
        ownerType: workspaceOwnerTable.ownerType,
        ownerName: sql<string>`
          CASE 
            WHEN ${workspaceOwnerTable.ownerType} = 'USER' 
            THEN (SELECT name FROM user WHERE id = ${workspaceOwnerTable.userId})
            ELSE (SELECT name FROM org WHERE id = ${workspaceOwnerTable.orgId})
          END
        `.as('ownerName'),
      },
    })
    .from(workspaceTable)
    .leftJoin(
      workspaceOwnerTable,
      eq(workspaceTable.id, workspaceOwnerTable.wsId)
    );
}

// Helper function to check workspace permissions
async function assertWorkspacePermission(
  db: DbType,
  wsId: string,
  userId: string,
  requiredRoles: ('OWNER' | 'ADMIN' | 'MEMBER')[] = ['OWNER']
) {
  const member = await getWorkspaceMember(db, wsId, userId);
  if (!member) {
    throw new ApiError('FORBIDDEN', 'You are not a member of this workspace');
  }

  if (!requiredRoles.includes(member.role)) {
    throw new ApiError(
      'FORBIDDEN',
      'You do not have permission to perform this action'
    );
  }
  return member;
}

// Set user's default workspace
export async function setUserDefaultWorkspace(
  db: DbType,
  { userId, wsId }: { userId: string; wsId: string }
) {
  return (
    await db
      .update(userTable)
      .set({ defaultWsId: wsId })
      .where(eq(userTable.id, userId))
      .returning()
  )[0];
}

// Get all workspaces accessible by a user (owned directly or through org membership)
export async function getUserAccessibleWorkspaces(db: DbType, userId: string) {
  const workspaces = await getWorkspaceSelectBuilder(db)
    .where(
      or(
        eq(workspaceOwnerTable.userId, userId),
        exists(
          db
            .select()
            .from(orgMemberTable)
            .where(
              and(
                eq(orgMemberTable.userId, userId),
                eq(orgMemberTable.orgId, workspaceOwnerTable.orgId)
              )
            )
        )
      )
    )
    .prepare();

  return workspaces.all();
}

export async function getUserWorkspaces(db: DbType, userId: string) {
  const workspaces = await getWorkspaceSelectBuilder(db)
    .where(eq(workspaceOwnerTable.userId, userId))
    .prepare();
  return workspaces.all();
}

// Get all workspaces owned by an org
export async function getOrgWorkspaces(db: DbType, orgId: string) {
  const workspaces = await getWorkspaceSelectBuilder(db)
    .where(eq(workspaceOwnerTable.orgId, orgId))
    .prepare();
  return workspaces.all();
}

export async function getWorkspaceByOwnerId(
  db: DbType,
  { ownerId, name }: { ownerId: string; name: string }
) {
  const workspace = await getWorkspaceSelectBuilder(db)
    .where(
      and(
        eq(workspaceTable.name, name),
        or(
          eq(workspaceOwnerTable.userId, ownerId),
          eq(workspaceOwnerTable.orgId, ownerId)
        )
      )
    )
    .limit(1)
    .prepare();

  const result = await workspace.all();
  return result[0] ?? null;
}

export async function getWorkspaceBySlug(db: DbType, slug: string) {
  const [ownerName, workspaceName] = slug.split('/');
  if (!ownerName || !workspaceName) {
    throw new ApiError('BAD_REQUEST', 'Invalid workspace slug format');
  }

  const workspace = await getWorkspaceSelectBuilder(db)
    .where(
      and(
        eq(workspaceTable.name, workspaceName),
        or(
          and(
            eq(workspaceOwnerTable.ownerType, 'USER'),
            exists(
              db
                .select()
                .from(userTable)
                .where(
                  and(
                    eq(userTable.id, workspaceOwnerTable.userId),
                    eq(userTable.name, ownerName)
                  )
                )
            )
          ),
          and(
            eq(workspaceOwnerTable.ownerType, 'ORG'),
            exists(
              db
                .select()
                .from(orgTable)
                .where(
                  and(
                    eq(orgTable.id, workspaceOwnerTable.orgId),
                    eq(orgTable.name, ownerName)
                  )
                )
            )
          )
        )
      )
    )
    .limit(1)
    .prepare();

  const result = await workspace.all();
  return result[0] ?? null;
}

// Get workspace by ID
export async function getWorkspaceByWsId(db: DbType, wsId: string) {
  const workspace = await getWorkspaceSelectBuilder(db)
    .where(eq(workspaceTable.id, wsId))
    .limit(1)
    .prepare();

  const result = await workspace.all();
  return result[0] ?? null;
}
// Create workspace with owner
export async function createWorkspace(
  db: DbType,
  { name, ownerId, ownerType, desc }: InsertWorkspaceType
) {
  // Create workspace
  const [workspace] = await db
    .insert(workspaceTable)
    .values({ name, desc })
    .returning();

  if (!workspace) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create workspace');
  }

  // Create workspace owner
  await db.insert(workspaceOwnerTable).values({
    wsId: workspace.id,
    userId: ownerType === 'USER' ? ownerId : null,
    orgId: ownerType === 'ORG' ? ownerId : null,
    ownerType,
  });

  // Get workspace with owner info using select builder
  const result = await getWorkspaceSelectBuilder(db)
    .where(eq(workspaceTable.id, workspace.id))
    .limit(1)
    .prepare()
    .all();

  if (!result.length) {
    throw new ApiError(
      'INTERNAL_SERVER_ERROR',
      'Failed to get created workspace'
    );
  }
  const ws = result[0];

  if (!ws?.owner) {
    throw new ApiError(
      'INTERNAL_SERVER_ERROR',
      'Failed to get created workspace owner'
    );
  }

  return ws;
}

// Delete workspace
export async function deleteWorkspace(
  db: DbType,
  { wsId, userId }: { wsId: string; userId: string }
) {
  await assertWorkspacePermission(db, wsId, userId, ['OWNER']);
  await db.delete(workspaceTable).where(eq(workspaceTable.id, wsId));
}

// Update workspace name
export async function updateWorkspaceName(
  db: DbType,
  {
    wsId,
    name,
    userId,
  }: {
    wsId: string;
    name: string;
    userId: string;
  }
) {
  await assertWorkspacePermission(db, wsId, userId, ['OWNER', 'ADMIN']);
  return (
    await db
      .update(workspaceTable)
      .set({ name })
      .where(eq(workspaceTable.id, wsId))
      .returning()
  )[0];
}

// Update workspace avatar (check permissions)
export async function updateWorkspaceAvatar(
  db: DbType,
  {
    wsId,
    avatarUrl,
    userId,
  }: {
    wsId: string;
    avatarUrl: string;
    userId: string;
  }
) {
  await assertWorkspacePermission(db, wsId, userId, ['OWNER', 'ADMIN']);
  return (
    await db
      .update(workspaceTable)
      .set({ avatarUrl })
      .where(eq(workspaceTable.id, wsId))
      .returning()
  )[0];
}
// Get workspace member
export async function getWorkspaceMember(
  db: DbType,
  wsId: string,
  userId: string
) {
  const workspace = await db.query.workspaceTable.findFirst({
    where: eq(workspaceTable.id, wsId),
    with: {
      owner: {
        with: {
          user: true,
          org: {
            with: {
              members: {
                where: eq(orgMemberTable.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    return null;
  }

  // User is direct owner
  if (workspace.owner.userId === userId) {
    return { role: 'OWNER' as const };
  }

  // Check org membership
  if (workspace.owner.org?.members.length) {
    return workspace.owner.org.members[0];
  }

  return null;
}
