import { ApiError } from "@/lib/error/error";
import { isStored, storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import {
  CreateWorkspaceSchema,
  UpdateWorkspaceAvatarSchema,
  UpdateWorkspaceSlugSchema,
  UpdateWorkspacerNameSchema,
} from "@/lib/zod/schemas/workspace";
import {
  addWorkspaceMember,
  clearWorkspaceAsDefault,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceBySlug,
  getWorkspacesByUserId,
  updateWorkspaceAvatar,
  updateWorkspaceName,
  updateWorkspaceSlug,
} from "@/server/data-access/workspace";
import auth from "@/server/middleware/auth-user";
import authWorkspace from "@/server/middleware/auth-workspace";
import type { Context } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const workspace = new Hono<Context>()
  // Get all workspaces
  .use("/workspace/*", auth)
  .get("/workspace/all", async (c) => {
    const { db, userId } = c.var;
    const workspaces = await getWorkspacesByUserId(db, userId);
    return c.json(workspaces);
  })
  // Get workspace by slug
  .get("/workspace/:slug", authWorkspace, async (c) => {
    const ws = c.get("ws");
    return c.json(ws);
  })

  // Create workspace
  .post(
    "/workspace/new",
    zValidator("json", CreateWorkspaceSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { name, slug } = c.req.valid("json");
      const ws = await getWorkspaceBySlug(db, slug);
      if (ws) {
        throw new ApiError(
          "CONFLICT",
          "Workspace with this slug already exists",
        );
      }
      const workspace = await createWorkspace(db, { name, slug });
      if (!workspace) {
        throw new ApiError(
          "INTERNAL_SERVER_ERROR",
          "Failed to create workspace",
        );
      }
      const member = await addWorkspaceMember(db, {
        userId,
        workspaceId: workspace.id,
        role: "OWNER",
      });

      if (!member) {
        throw new ApiError(
          "INTERNAL_SERVER_ERROR",
          "Failed to add workspace member",
        );
      }
      // revalidatePath("/workspaces");
      return c.json({
        workspace,
        member,
      });
    },
  )

  // Delete workspace
  .delete("/workspace/:workspaceId", authWorkspace, async (c) => {
    const { db, ws } = c.var;
    await clearWorkspaceAsDefault(db, ws.id);
    await deleteWorkspace(db, ws.id);
    return c.json({});
  })
  // Update workspace name
  .put(
    "/workspace/:workspaceId/name",
    authWorkspace,
    zValidator("json", UpdateWorkspacerNameSchema),
    async (c) => {
      const { db, ws } = c.var;
      const { name } = c.req.valid("json");
      const newWs = await updateWorkspaceName(db, ws.id, name);
      return c.json(newWs);
    },
  )
  // Update workspace slug
  .put(
    "/workspace/:workspaceId/slug",
    authWorkspace,
    zValidator("json", UpdateWorkspaceSlugSchema),
    async (c) => {
      const db = c.get("db");
      const { workspaceId } = c.req.param();
      const { slug } = c.req.valid("json");
      const ws = await updateWorkspaceSlug(db, workspaceId, slug);
      if (!ws) {
        throw new ApiError(
          "INTERNAL_SERVER_ERROR",
          "Failed to update workspace slug",
        );
      }
      return c.json(ws);
    },
  )
  // Update workspace avatar
  .put(
    "/workspace/:workspaceId/avatar",
    authWorkspace,
    zValidator("form", UpdateWorkspaceAvatarSchema),
    async (c) => {
      const { db, ws } = c.var;
      const { workspaceId } = c.req.param();
      const { image } = c.req.valid("form");
      const { url } = await storage.upload(`ws-avatars/${generateId()}`, image);
      const newWs = await updateWorkspaceAvatar(db, workspaceId, url);
      c.ctx.waitUntil(
        (async () => {
          if (ws.avatarUrl && isStored(ws.avatarUrl)) {
            await storage.delete(ws.avatarUrl);
          }
        })(),
      );
      // revalidatePath("/");
      return c.json(newWs);
    },
  );

export default workspace;
