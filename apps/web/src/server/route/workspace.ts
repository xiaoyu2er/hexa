import { ApiError } from "@/lib/error/error";
import {
  CreateWorkspaceSchema,
  SetUserDefaultWorkspaceSchema,
} from "@/lib/zod/schemas/workspace";
import {
  addWorkspaceMember,
  clearWorkspaceAsDefault,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceBySlug,
  getWorkspaceByWsId,
  getWorkspacesByUserId,
  setUserDefaultWorkspace,
} from "@/server/data-access/workspace";
import auth from "@/server/middleware/auth";
import type { ContextVariables } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const workspace = new Hono<{ Variables: ContextVariables }>()
  // Get all workspaces
  .use("/workspace/*", auth)
  .get("/workspace/all", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const workspaces = await getWorkspacesByUserId(db, user.id);
    return c.json(workspaces);
  })
  // Get workspace by slug
  .get("/workspace/:slug", async (c) => {
    const db = c.get("db");
    const { slug } = c.req.param();
    const ws = await getWorkspaceBySlug(db, slug);
    if (!ws) {
      throw new ApiError("NOT_FOUND", "Workspace not found");
    }
    return c.json(ws);
  })
  // Set user default workspace
  .post(
    "/workspace/default",
    zValidator("json", SetUserDefaultWorkspaceSchema),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("json");
      const ws = await getWorkspaceByWsId(db, workspaceId);
      if (!ws) {
        throw new ApiError("NOT_FOUND", "Workspace not found");
      }
      const defaultWs = await setUserDefaultWorkspace(db, user.id, workspaceId);
      // revalidatePath("/");
      return c.json(defaultWs);
    },
  )
  // Create workspace
  .post(
    "/workspace/new",
    zValidator("json", CreateWorkspaceSchema),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
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
        userId: user.id,
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
  .delete("/workspace/:workspaceId", async (c) => {
    const db = c.get("db");
    // const user = c.get("user");
    const { workspaceId } = c.req.param();
    await clearWorkspaceAsDefault(db, workspaceId);
    await deleteWorkspace(db, workspaceId);
    return c.json({});
  })
  // Update workspace name
  .put("/workspace/:workspaceId", async (c) => {});

// export const updateWorkspaceNameAction = authenticatedProcedure
//   .createServerAction()
//   .input(UpdateWorkspacerNameSchema)
//   .handler(async ({ input }) => {
//     const { name, workspaceId } = input;
//     const db = await getDB();
//     await updateWorkspaceName(db, workspaceId, name);
//     revalidatePath("/");
//     return {};
//   });

// export const updateWorkspaceSlugAction = authenticatedProcedure
//   .createServerAction()
//   .input(UpdateWorkspaceSlugSchema)
//   .handler(async ({ input }) => {
//     const { slug, workspaceId } = input;
//     const db = await getDB();
//     const ws = await updateWorkspaceSlug(db, workspaceId, slug);
//     revalidatePath("/");
//     return {
//       workspace: ws,
//     };
//   });

// export const updateWorkspaceAvatarAction = authenticatedProcedure
//   .createServerAction()
//   .input(UpdateWorkspaceAvatarSchema)
//   .handler(async ({ input }) => {
//     const { image, workspaceId } = input;
//     const db = await getDB();
//     const ws = await getWorkspaceByWsId(db, workspaceId);
//     if (!ws) {
//       throw new ZSAError("NOT_FOUND", "Workspace not found");
//     }

//     const { url } = await storage.upload(`ws-avatars/${generateId()}`, image);
//     await updateWorkspaceAvatar(db, workspaceId, url);
//     waitUntil(
//       (async () => {
//         if (ws.avatarUrl && isStored(ws.avatarUrl)) {
//           await storage.delete(ws.avatarUrl);
//         }
//       })(),
//     );
//     revalidatePath("/");
//   });
export default workspace;
