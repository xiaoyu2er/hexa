import { eq } from "drizzle-orm";
import { getDrizzle } from "../db";
import {
  type WorkspaceMemberModel,
  type WorkspaceModel,
  userTable,
  workspaceMemberTable,
  workspaceTable,
} from "../schema";

export const setUserDefaultWorkspace = async (
  userId: string,
  workspaceId: string,
) => {
  const db = await getDrizzle();
  return (
    await db
      .update(userTable)
      .set({ defaultWorkspaceId: workspaceId })
      .where(eq(userTable.id, userId))
      .returning()
  )[0];
};

export const getWorkspacesByUserId = async (userId: string) => {
  const db = await getDrizzle();
  return (
    await db.query.workspaceMemberTable.findMany({
      where: (table, { eq }) => eq(table.userId, userId),
      with: {
        workspace: true,
      },
    })
  ).map((wm) => wm.workspace);
};

export const getWorkspaceBySlug = async (slug: string) => {
  const db = await getDrizzle();
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });
};

export const getWorkspaceByWsId = async (wsId: string) => {
  const db = await getDrizzle();
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.id, wsId),
  });
};

export const createWorkspace = async ({
  name,
  slug,
}: Pick<WorkspaceModel, "name" | "slug">) => {
  const db = await getDrizzle();
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

export const addWorkspaceMember = async ({
  userId,
  workspaceId,
  role,
}: Pick<WorkspaceMemberModel, "userId" | "workspaceId" | "role">) => {
  const db = await getDrizzle();
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

export const deleteWorkspace = async (workspaceId: string) => {
  const db = await getDrizzle();
  await db
    .delete(workspaceTable)
    .where(eq(workspaceTable.id, workspaceId))
    .returning();
};

export const clearWorkspaceAsDefault = async (workspaceId: string) => {
  const db = await getDrizzle();
  await db
    .update(userTable)
    .set({ defaultWorkspaceId: null })
    .where(eq(userTable.defaultWorkspaceId, workspaceId))
    .returning();
};

// update name
export async function updateWorkspaceName(id: string, name: string) {
  const db = await getDrizzle();
  return (
    await db
      .update(workspaceTable)
      .set({ name })
      .where(eq(workspaceTable.id, id))
      .returning()
  )[0];
}
// update slug
export async function updateWorkspaceSlug(id: string, slug: string) {
  const db = await getDrizzle();
  return (
    await db
      .update(workspaceTable)
      .set({ slug })
      .where(eq(workspaceTable.id, id))
      .returning()
  )[0];
}

// update avatar
export async function updateWorkspaceAvatar(id: string, avatarUrl: string) {
  const db = await getDrizzle();
  return (
    await db
      .update(workspaceTable)
      .set({ avatarUrl })
      .where(eq(workspaceTable.id, id))
      .returning()
  )[0];
}
