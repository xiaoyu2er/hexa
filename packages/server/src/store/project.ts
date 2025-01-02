'use server';

import { ApiError } from '@hexa/lib';
import type {
  InsertProjectType,
  SelectProjectType,
} from '@hexa/server/schema/project';
import { orgTable } from '@hexa/server/table/org';
import { orgMemberTable } from '@hexa/server/table/org-member';
import { projectTable } from '@hexa/server/table/project';
import { userTable } from '@hexa/server/table/user';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import type { DbType } from '../route/route-types';

export const getDefaultDomains = async () => {
  return process.env.DEFAULT_DOMAINS?.split(',') ?? [];
};

// Helper function to check project permissions
export async function assertProjectPermission(
  db: DbType,
  projectId: string,
  userId: string,
  requiredRoles: ('OWNER' | 'ADMIN' | 'MEMBER')[] = ['OWNER']
) {
  const member = await getProjectMember(db, projectId, userId);
  if (!member) {
    throw new ApiError('FORBIDDEN', 'You are not a member of this project');
  }

  if (!requiredRoles.includes(member.role)) {
    throw new ApiError(
      'FORBIDDEN',
      'You do not have permission to perform this action'
    );
  }
  return member;
}

// Set user's default project
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

// Get all projects accessible by a user (owned directly or through org membership)
export async function getUserAccessibleProjects(
  db: DbType,
  userId: string
): Promise<SelectProjectType[]> {
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

  const domains = await getDefaultDomains();

  return (await projects.all())
    .filter((project) => Boolean(project.org.members[0]))
    .map((project) => {
      // Extract role from members array
      // @ts-expect-error
      const role = project.org.members[0].role;

      // Create new org object without members
      const { members, ...orgWithoutMembers } = project.org;

      // Return cleaned up project object
      return {
        ...project,
        domains,
        org: orgWithoutMembers,
        role,
      };
    });
}

// Get all projects owned by an org
export async function getOrgProjects(db: DbType, orgId: string) {
  const projects = await db.query.projectTable.findMany({
    where: eq(projectTable.orgId, orgId),
    with: {
      org: true,
    },
  });

  return projects;
}

export async function getProjectBySlug(
  db: DbType,
  { orgId, slug }: { orgId: string; slug: string }
) {
  const project = await db.query.projectTable.findFirst({
    where: and(eq(projectTable.slug, slug), eq(projectTable.orgId, orgId)),
    with: {
      org: true,
    },
  });

  return project;
}

export async function getLastJoinedOrgsFirstProject(
  db: DbType,
  userId: string
): Promise<SelectProjectType | null> {
  // Get the latest org membership for the user
  const latestOrgMember = await db.query.orgMemberTable.findFirst({
    where: eq(orgMemberTable.userId, userId),
    with: {
      org: true,
    },
    orderBy: desc(orgMemberTable.createdAt),
  });

  if (!latestOrgMember) {
    return null;
  }

  // Get the first project for this org
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.orgId, latestOrgMember.orgId),
    with: {
      org: {
        with: {
          members: {
            where: eq(orgMemberTable.userId, userId),
          },
        },
      },
    },
    orderBy: asc(projectTable.id),
  });

  if (!project) {
    return null;
  }

  const domains = await getDefaultDomains();

  return {
    ...project,
    domains,
    role: project.org.members[0]?.role ?? 'MEMBER',
  };
}

export async function getProjectWithRole(
  db: DbType,
  { projectId, userId }: { projectId: string; userId: string }
): Promise<SelectProjectType | null> {
  if (!projectId) {
    return null;
  }
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.id, projectId),
    with: {
      org: {
        with: {
          members: {
            where: eq(orgMemberTable.userId, userId),
          },
          domains: true,
        },
      },
    },
  });

  if (!project) {
    // throw new ApiError('NOT_FOUND', 'Project not found');
    return null;
  }

  if (!project.org.members[0]) {
    // throw new ApiError('NOT_FOUND', 'Project not found');
    return null;
  }

  const member = project.org.members[0];

  const domains = await getDefaultDomains();

  return {
    ...project,
    domains,
    role: member.role,
  };
}

export async function getProjectWithRoleBySlug(
  db: DbType,
  projectSlug: string,
  orgSlug: string,
  userId: string
): Promise<SelectProjectType | null> {
  const subquery = db
    .select({ projectId: projectTable.id })
    .from(projectTable)
    .innerJoin(orgTable, eq(orgTable.id, projectTable.orgId))
    .where(and(eq(projectTable.slug, projectSlug), eq(orgTable.slug, orgSlug)));

  const project = await db.query.projectTable.findFirst({
    where: inArray(projectTable.id, subquery),
    with: {
      org: {
        columns: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
          desc: true,
        },
        with: {
          members: true,
        },
      },
    },
  });

  if (!project || !project.org) {
    return null;
  }

  const member = project.org.members.find((m) => m.userId === userId);
  if (!member) {
    return null;
  }

  const domains = await getDefaultDomains();

  return {
    ...project,
    domains,
    role: member.role,
  };
}

// Create project with owner
export async function createProject(
  db: DbType,
  { name, orgId, desc, slug }: InsertProjectType
) {
  // Create project
  const [project] = await db
    .insert(projectTable)
    .values({ name, orgId, desc, slug })
    .returning();

  if (!project) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create project');
  }

  return project;
}

// Delete project
export async function deleteProject(
  db: DbType,
  { projectId }: { projectId: string }
) {
  // First update any users who have this as their default project
  await db
    .update(userTable)
    .set({ defaultProjectId: null })
    .where(eq(userTable.defaultProjectId, projectId));

  await db.delete(projectTable).where(eq(projectTable.id, projectId));
}

// Update project name
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
): Promise<SelectProjectType> {
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
    .set({ defaultProjectId: project.id })
    .where(eq(userTable.defaultProjectId, projectId));

  const projectWithRole = await getProjectWithRole(db, {
    projectId: project.id,
    userId,
  });

  if (!projectWithRole) {
    throw new ApiError('NOT_FOUND', 'Project not found');
  }

  return projectWithRole;
}

// Update project avatar
export async function updateProjectAvatar(
  db: DbType,
  {
    projectId,
    avatarUrl,
  }: {
    projectId: string;
    avatarUrl: string;
  }
) {
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
