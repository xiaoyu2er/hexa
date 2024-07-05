import { db } from "../db";
import {
  WorkspaceMemberModel,
  WorkspaceModel,
  workspaceMemberTable,
  workspaceTable,
} from "../schema";

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

export const queryWorkspaceBySlug = async (slug: string) => {
  return db.query.workspaceTable.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
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
