"use server";

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
import { getDB } from "@/server/db";
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
} from "@/server/db/data-access/workspace";
import { waitUntil } from "@vercel/functions";
import { revalidatePath } from "next/cache";
import { ZSAError } from "zsa";
import { authenticatedProcedure } from "./procedures";

export const getWorkspacesAction = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDB();
    const workspaces = await getWorkspacesByUserId(db, user.id);
    return {
      workspaces,
    };
  });

export const getWorkspaceBySlugAction = authenticatedProcedure
  .createServerAction()
  .input(GetWorkspaceBySlugSchema)
  .handler(async ({ input }) => {
    const { slug } = input;
    const db = await getDB();
    const ws = await getWorkspaceBySlug(db, slug);
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
    const db = await getDB();
    const ws = await getWorkspaceByWsId(db, workspaceId);
    if (!ws) {
      throw new ZSAError("NOT_FOUND", "Workspace not found");
    }
    waitUntil(setUserDefaultWorkspace(db, user.id, workspaceId));

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
    const db = await getDB();
    const ws = await getWorkspaceBySlug(db, slug);
    if (ws) {
      throw new ZSAError("CONFLICT", "Workspace with this slug already exists");
    }
    const workspace = await createWorkspace(db, { name, slug });
    if (!workspace) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create workspace");
    }

    const member = await addWorkspaceMember(db, {
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
    const db = await getDB();
    await clearWorkspaceAsDefault(db, workspaceId);
    await deleteWorkspace(db, workspaceId);
    return {};
  });

export const updateWorkspaceNameAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateWorkspacerNameSchema)
  .handler(async ({ input }) => {
    const { name, workspaceId } = input;
    const db = await getDB();
    await updateWorkspaceName(db, workspaceId, name);
    revalidatePath("/");
    return {};
  });

export const updateWorkspaceSlugAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateWorkspaceSlugSchema)
  .handler(async ({ input }) => {
    const { slug, workspaceId } = input;
    const db = await getDB();
    const ws = await updateWorkspaceSlug(db, workspaceId, slug);
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
    const db = await getDB();
    const ws = await getWorkspaceByWsId(db, workspaceId);
    if (!ws) {
      throw new ZSAError("NOT_FOUND", "Workspace not found");
    }

    const { url } = await storage.upload(`ws-avatars/${generateId()}`, image);
    await updateWorkspaceAvatar(db, workspaceId, url);
    waitUntil(
      (async () => {
        if (ws.avatarUrl && isStored(ws.avatarUrl)) {
          await storage.delete(ws.avatarUrl);
        }
      })(),
    );
    revalidatePath("/");
  });
