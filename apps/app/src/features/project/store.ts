import { userTable } from '@/features/user/table';
import { ApiError } from '@/lib/error/error';
import { eq, inArray } from 'drizzle-orm';

import { orgMemberTable } from '@/features/org-member/table';
import type { InsertProjectType } from '@/features/project/schema';
import { projectTable } from '@/features/project/table';
import type { DbType } from '../../lib/route-types';

// Helper function to check workspace permissions
async function assertProjectPermission(
  db: DbType,
  projectId: string,
  userId: string,
  requiredRoles: ('OWNER' | 'ADMIN' | 'MEMBER')[] = ['OWNER']
) {
  const member = await getProjectMember(db, projectId, userId);
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
export async function setUserDefaultProject(
  db: DbType,
  { userId, projectId }: { userId: string; projectId: string | null }
) {
  return (
    await db
      .update(userTable)
      .set({ defaultProjectId: projectId })
      .where(eq(userTable.id, userId))
      .returning()
  )[0];
}

// Get all workspaces accessible by a user (owned directly or through org membership)
export async function getUserAccessibleProjects(db: DbType, userId: string) {
  const subquery = db
    .select({
      projectId: projectTable.id,
    })
    .from(projectTable)
    .innerJoin(orgMemberTable, eq(orgMemberTable.orgId, projectTable.orgId))
    .where(eq(orgMemberTable.userId, userId));

  const projects = await db.query.projectTable
    .findMany({
      where: inArray(projectTable.id, subquery),
      with: {
        org: {
          with: {
            members: {
              where: eq(orgMemberTable.userId, userId),
            },
          },
        },
      },
    })
    .prepare();

  return (await projects.all()).map((project) => {
    // Extract role from members array
    const role = project.org.members?.[0]?.role || null;

    // Create new org object without members
    const { members, ...orgWithoutMembers } = project.org;

    // Return cleaned up project object
    return {
      ...project,
      org: orgWithoutMembers,
      role,
    };
  });
}

// Get all workspaces owned by an org
export async function getOrgProjects(db: DbType, orgId: string) {
  const projects = await db.query.projectTable.findMany({
    where: eq(projectTable.orgId, orgId),
    with: {
      org: true,
    },
  });

  return projects;
}

export async function getProjectBySlug(db: DbType, { slug }: { slug: string }) {
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.slug, slug),
    with: {
      org: true,
    },
  });

  return project;
}
// Get workspace by ID
export async function getProject(db: DbType, projectId: string) {
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.id, projectId),
    with: {
      org: true,
    },
  });

  return project;
}

// Get workspace by ID
export async function getProjectWithRole(
  db: DbType,
  projectId: string,
  userId: string
) {
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.id, projectId),
    with: {
      org: {
        with: {
          members: {
            where: eq(orgMemberTable.userId, userId),
          },
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const member = project.org.members?.[0];
  return {
    ...project,
    role: member?.role || null,
  };
}

export async function getProjectWithRoleBySlug(
  db: DbType,
  slug: string,
  userId: string
) {
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.slug, slug),
    with: {
      org: {
        with: {
          members: {
            where: eq(orgMemberTable.userId, userId),
          },
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    ...project,
    role: project.org.members?.[0]?.role || null,
  };
}

// Create workspace with owner
export async function createProject(
  db: DbType,
  { name, orgId, desc, slug }: InsertProjectType
) {
  // Create workspace
  const [project] = await db
    .insert(projectTable)
    .values({ name, orgId, desc, slug })
    .returning();

  if (!project) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create workspace');
  }

  return project;
}

// Delete workspace
export async function deleteProject(
  db: DbType,
  { projectId, userId }: { projectId: string; userId: string }
) {
  await assertProjectPermission(db, projectId, userId, ['OWNER', 'ADMIN']);
  await db.delete(projectTable).where(eq(projectTable.id, projectId));
}

// Update workspace name
export async function updateProjectName(
  db: DbType,
  {
    projectId,
    name,
    userId,
  }: {
    projectId: string;
    name: string;
    userId: string;
  }
) {
  await assertProjectPermission(db, projectId, userId, ['OWNER', 'ADMIN']);
  return (
    await db
      .update(projectTable)
      .set({ name })
      .where(eq(projectTable.id, projectId))
      .returning()
  )[0];
}

export async function updateProjectSlug(
  db: DbType,
  {
    projectId,
    slug,
    userId,
  }: { projectId: string; slug: string; userId: string }
) {
  await assertProjectPermission(db, projectId, userId, ['OWNER', 'ADMIN']);

  const project = (
    await db
      .update(projectTable)
      .set({ slug })
      .where(eq(projectTable.id, projectId))
      .returning()
  )[0];

  if (!project) {
    throw new ApiError(
      'INTERNAL_SERVER_ERROR',
      'Failed to update project slug'
    );
  }

  await db
    .update(userTable)
    .set({ defaultProjectId: project?.id })
    .where(eq(userTable.defaultProjectId, projectId));

  return project;
}

// Update workspace avatar (check permissions)
export async function updateProjectAvatar(
  db: DbType,
  {
    projectId,
    avatarUrl,
    userId,
  }: {
    projectId: string;
    avatarUrl: string;
    userId: string;
  }
) {
  await assertProjectPermission(db, projectId, userId, ['OWNER', 'ADMIN']);
  return (
    await db
      .update(projectTable)
      .set({ avatarUrl })
      .where(eq(projectTable.id, projectId))
      .returning()
  )[0];
}

export async function getProjectMember(
  db: DbType,
  projectId: string,
  userId: string
) {
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.id, projectId),
    with: {
      org: {
        with: {
          members: {
            where: eq(orgMemberTable.userId, userId),
          },
        },
      },
    },
  });

  if (!project?.org?.members.length) {
    return null;
  }

  return project.org.members[0];
}
