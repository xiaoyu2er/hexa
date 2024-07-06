"use server";

import { ZSAError } from "zsa";
import {
  addWorkspaceMember,
  clearWorkspaceAsDefault,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceBySlug,
  getWorkspaceByWsId,
  setUserDefaultWorkspace,
  updateWorkspaceAvatar,
  updateWorkspaceName,
} from "@/lib/db/data-access/workspace";
import {
  CreateWorkspaceSchema,
  DeleteWorkspaceSchema,
  SetUserDefaultWorkspaceSchema,
  UpdateWorkspaceAvatarSchema,
  UpdateWorkspacerNameSchema,
} from "@/lib/zod/schemas/workspace";
import { authenticatedProcedure } from "./procedures";
import { revalidatePath } from "next/cache";
import { waitUntil } from "@vercel/functions";
import { isStored, storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { updateUserAvatar } from "@/lib/db/data-access/user";

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
        "Failed to add workspace member"
      );
    }

    revalidatePath("/workspaces");

    return {
      //   workspace,
      //   member,
    };
  });

export const deleteWorkspaceAction = authenticatedProcedure
  .createServerAction()
  .input(DeleteWorkspaceSchema)
  .handler(async ({ input }) => {
    const { workspaceId } = input;
    await clearWorkspaceAsDefault(workspaceId);
    await deleteWorkspace(workspaceId);
    return {};
  });

export const updateWorkspaceNameAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateWorkspacerNameSchema)
  .handler(async ({ input }) => {
    const { name, workspaceId } = input;
    console.log("updateWorkspaceNameAction", name, workspaceId);
    await updateWorkspaceName(workspaceId, name);
    revalidatePath("/");
    return {};
  });

export const updateWorkspaceAvatarAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateWorkspaceAvatarSchema)
  .handler(async ({ input, ctx }) => {
    const { image, workspaceId } = input;
    const ws = await getWorkspaceByWsId(workspaceId);
    if (!ws) {
      throw new ZSAError("NOT_FOUND", "Workspace not found");
    }

    const { url } = await storage.upload(`ws-avatars/${generateId()}`, image);
    await updateWorkspaceAvatar(workspaceId, url);
    waitUntil(
      (async () => {
        if (ws.avatarUrl && isStored(ws.avatarUrl)) {
          await storage.delete(ws.avatarUrl);
        }
      })()
    );
    revalidatePath("/");
  });
