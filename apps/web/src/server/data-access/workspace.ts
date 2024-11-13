import {
  type WorkspaceMemberModel,
  type WorkspaceModel,
  userTable,
  workspaceMemberTable,
  workspaceTable,
} from '@/server/db/schema';
import type { DbType } from '@/server/types';
import { eq } from 'drizzle-orm';

export const setUserDefaultWorkspace = async (
  db: DbType,
  userId: string,
  workspaceId: string
) => {
  return (
    await db
      .update(userTable)
      .set({ defaultWorkspaceId: workspaceId })
      .where(eq(userTable.id, userId))
      .returning()
  )[0];
};

export const getWorkspacesByUserId = async (db: DbType, userId: string) => {
  return (
    await db.query.workspaceMemberTable.findMany({
      where: (table, { eq }) => eq(table.userId, userId),
      with: {
        workspace: true,
      },
    })
  ).map((wm) => wm.workspace);
};

export const getWorkspaceBySlug = async (db: DbType, slug: string) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });
};

export const getWorkspaceBySlugWithMembers = async (
  db: DbType,
  slug: string
) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
    with: {
      members: true,
    },
  });
};

export const getWorkspaceByWsId = async (db: DbType, wsId: string) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.id, wsId),
  });
};

export const getWorkspaceByWsIdWithMembers = async (
  db: DbType,
  wsId: string
) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.id, wsId),
    with: {
      members: true,
    },
  });
};

export const createWorkspace = async (
  db: DbType,
  { name, slug }: Pick<WorkspaceModel, 'name' | 'slug'>
) => {
  return (
    await db
      .insert(workspaceTable)
      .values({
        // for better formatting
        name,
        slug,
      })
      .returning()
  )[0];
};

export const addWorkspaceMember = async (
  db: DbType,
  {
    userId,
    workspaceId,
    role,
  }: Pick<WorkspaceMemberModel, 'userId' | 'workspaceId' | 'role'>
) => {
  return (
    await db
      .insert(workspaceMemberTable)
      .values({
        userId,
        workspaceId,
        role,
      })
      .returning()
  )[0];
};

export const deleteWorkspace = async (db: DbType, workspaceId: string) => {
  await db
    .delete(workspaceTable)
    .where(eq(workspaceTable.id, workspaceId))
    .returning();
};

export const clearWorkspaceAsDefault = async (
  db: DbType,
  workspaceId: string
) => {
  await db
    .update(userTable)
    .set({ defaultWorkspaceId: null })
    .where(eq(userTable.defaultWorkspaceId, workspaceId))
    .returning();
};

// update name
export async function updateWorkspaceName(
  db: DbType,
  id: string,
  name: string
) {
  return (
    await db
      .update(workspaceTable)
      .set({ name })
      .where(eq(workspaceTable.id, id))
      .returning()
  )[0];
}
// update slug
export async function updateWorkspaceSlug(
  db: DbType,
  id: string,
  slug: string
) {
  return (
    await db
      .update(workspaceTable)
      .set({ slug })
      .where(eq(workspaceTable.id, id))
      .returning()
  )[0];
}

// update avatar
export async function updateWorkspaceAvatar(
  db: DbType,
  id: string,
  avatarUrl: string
) {
  return (
    await db
      .update(workspaceTable)
      .set({ avatarUrl })
      .where(eq(workspaceTable.id, id))
      .returning()
  )[0];
}

export async function getWorkspaceMember(
  db: DbType,
  workspaceId: string,
  userId: string
) {
  return db.query.workspaceMemberTable.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.userId, userId), eq(table.workspaceId, workspaceId)),
  });
}
