"use server";

import { ZSAError } from "zsa";
import {
  addWorkspaceMember,
  createWorkspace,
  getWorkspaceBySlug,
  getWorkspaceByWsId,
  setUserDefaultWorkspace,
} from "../db/data-access/workspace";
import {
  CreateWorkspaceSchema,
  SetUserDefaultWorkspaceSchema,
} from "../zod/schemas/workspace";
import { authenticatedProcedure } from "./procedures";
import { revalidatePath } from "next/cache";
import { waitUntil } from "@vercel/functions";

export const setUserDefaultWorkspaceAction = authenticatedProcedure
  .createServerAction()
  .input(SetUserDefaultWorkspaceSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { workspaceId } = input;
    const ws = await getWorkspaceByWsId(workspaceId);
    if (!ws) {
      throw new ZSAError("NOT_FOUND", "Workspace not found");
    }
    waitUntil(setUserDefaultWorkspace(user.id, workspaceId));

    // revalidatePath("/");

    return {
      workspace: ws,
    };
  });

export const createWorkspaceAction = authenticatedProcedure
  .createServerAction()
  .input(CreateWorkspaceSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { name, slug } = input;
    const ws = await getWorkspaceBySlug(slug);
    if (ws) {
      throw new ZSAError("CONFLICT", "Workspace with this slug already exists");
    }
    const workspace = await createWorkspace({ name, slug });
    if (!workspace) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create workspace");
    }

    const member = await addWorkspaceMember({
      userId: user.id,
      workspaceId: workspace.id,
      role: "OWNER",
    });

    if (!member) {
      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to add workspace member",
      );
    }

    revalidatePath("/workspaces");

    return {
      //   workspace,
      //   member,
    };
  });
