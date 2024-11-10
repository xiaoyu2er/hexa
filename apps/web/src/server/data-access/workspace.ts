import { ApiError } from "@/lib/error/error";
import {
  type WorkspaceMemberModel,
  type WorkspaceModel,
  userTable,
  workspaceMemberTable,
  workspaceTable,
} from "@/server/db/schema";
import type { DBType } from "@/server/types";
import { eq } from "drizzle-orm";
import { getDB } from "../db";

export const setUserDefaultWorkspace = async (
  db: DBType,
  userId: string,
  workspaceId: string,
) => {
  return (
    await db
      .update(userTable)
      .set({ defaultWorkspaceId: workspaceId })
      .where(eq(userTable.id, userId))
      .returning()
  )[0];
};

export const getWorkspacesByUserId = async (db: DBType, userId: string) => {
  return (
    await db.query.workspaceMemberTable.findMany({
      where: (table, { eq }) => eq(table.userId, userId),
      with: {
        workspace: true,
      },
    })
  ).map((wm) => wm.workspace);
};

export const getWorkspaceBySlug = async (db: DBType, slug: string) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });
};

export const getWorkspaceByWsId = async (db: DBType, wsId: string) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.id, wsId),
  });
};

export const createWorkspace = async (
  db: DBType,
  { name, slug }: Pick<WorkspaceModel, "name" | "slug">,
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
  db: DBType,
  {
    userId,
    workspaceId,
    role,
  }: Pick<WorkspaceMemberModel, "userId" | "workspaceId" | "role">,
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

export const deleteWorkspace = async (db: DBType, workspaceId: string) => {
  await db
    .delete(workspaceTable)
    .where(eq(workspaceTable.id, workspaceId))
    .returning();
};

export const clearWorkspaceAsDefault = async (
  db: DBType,
  workspaceId: string,
) => {
  await db
    .update(userTable)
    .set({ defaultWorkspaceId: null })
    .where(eq(userTable.defaultWorkspaceId, workspaceId))
    .returning();
};

// update name
export async function updateWorkspaceName(
  db: DBType,
  id: string,
  name: string,
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
  db: DBType,
  id: string,
  slug: string,
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
  db: DBType,
  id: string,
  avatarUrl: string,
) {
  return (
    await db
      .update(workspaceTable)
      .set({ avatarUrl })
      .where(eq(workspaceTable.id, id))
      .returning()
  )[0];
}
