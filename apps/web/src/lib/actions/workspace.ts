"use server";

import {
  addWorkspaceMember,
  clearWorkspaceAsDefault,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceBySlug,
  getWorkspaceByWsId,
  getWorkspacesByUserId,
  setUserDefaultWorkspace,
  updateWorkspaceAvatar,
  updateWorkspaceName,
  updateWorkspaceSlug,
} from "@/lib/db/data-access/workspace";
import { isStored, storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import {
  CreateWorkspaceSchema,
  DeleteWorkspaceSchema,
  GetWorkspaceBySlugSchema,
  SetUserDefaultWorkspaceSchema,
  UpdateWorkspaceAvatarSchema,
  UpdateWorkspaceSlugSchema,
  UpdateWorkspacerNameSchema,
} from "@/lib/zod/schemas/workspace";
import { waitUntil } from "@vercel/functions";
import { revalidatePath } from "next/cache";
import { ZSAError } from "zsa";
import { authenticatedProcedure } from "./procedures";

export const getWorkspacesAction = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    const workspaces = await getWorkspacesByUserId(user.id);
    return {
      workspaces,
    };
  });

export const getWorkspaceBySlugAction = authenticatedProcedure
  .createServerAction()
  .input(GetWorkspaceBySlugSchema)
  .handler(async ({ input }) => {
    const { slug } = input;
    const ws = await getWorkspaceBySlug(slug);
    if (!ws) {
      throw new ZSAError("NOT_FOUND", "Workspace not found");
    }
    return {
      workspace: ws,
    };
  });

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
    await updateWorkspaceName(workspaceId, name);
    revalidatePath("/");
    return {};
  });

export const updateWorkspaceSlugAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateWorkspaceSlugSchema)
  .handler(async ({ input }) => {
    const { slug, workspaceId } = input;
    const ws = await updateWorkspaceSlug(workspaceId, slug);
    revalidatePath("/");
    return {
      workspace: ws,
    };
  });

export const updateWorkspaceAvatarAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateWorkspaceAvatarSchema)
  .handler(async ({ input }) => {
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
      })(),
    );
    revalidatePath("/");
  });
