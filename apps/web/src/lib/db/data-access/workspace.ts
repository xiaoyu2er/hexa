import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  WorkspaceMemberModel,
  WorkspaceModel,
  userTable,
  workspaceMemberTable,
  workspaceTable,
} from "../schema";

export const setUserDefaultWorkspace = async (
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

export const getWorkspacesByUserId = async (userId: string) => {
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
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });
};

export const getWorkspaceByWsId = async (wsId: string) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.id, wsId),
  });
};

export const createWorkspace = async ({
  name,
  slug,
}: Pick<WorkspaceModel, "name" | "slug">) => {
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
  await db
    .delete(workspaceTable)
    .where(eq(workspaceTable.id, workspaceId))
    .returning();
};

export const clearWorkspaceAsDefault = async (workspaceId: string) => {
  await db
    .update(userTable)
    .set({ defaultWorkspaceId: null })
    .where(eq(userTable.defaultWorkspaceId, workspaceId))
    .returning();
};
