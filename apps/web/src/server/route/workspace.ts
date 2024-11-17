import { ApiError } from '@/lib/error/error';
import { isStored, storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import {
  UpdateWorkspaceAvatarSchema,
  UpdateWorkspacerNameSchema,
} from '@/lib/zod/schemas/workspace';
import { getOrgByName } from '@/server/data-access/org';
import {
  createWorkspace,
  deleteWorkspace,
  getOrgWorkspaces,
  getUserAccessibleWorkspaces,
  getUserWorkspaces,
  setUserDefaultWorkspace,
  updateWorkspaceAvatar,
  updateWorkspaceName,
} from '@/server/data-access/workspace';
import { InsertWorkspaceSchema } from '@/server/db/schema';
import auth from '@/server/middleware/auth-user';
import authWorkspace from '@/server/middleware/auth-workspace';
import type { Context } from '@/server/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const workspace = new Hono<Context>()
  // Get all workspaces
  .use('/workspace/*', auth)
  .get('/workspace/all', async (c) => {
    const { db, userId } = c.var;
    const workspaces = await getUserAccessibleWorkspaces(db, userId);
    return c.json(workspaces);
  })
  .get(
    '/workspace/:owner',
    zValidator('param', z.object({ owner: z.string() })),
    async (c) => {
      const { db, userId, user } = c.var;
      const { owner } = c.req.param();
      if (owner === user.name) {
        const workspaces = await getUserWorkspaces(db, userId);
        return c.json(workspaces);
      }
      const org = await getOrgByName(db, owner);
      if (!org) {
        throw new ApiError('NOT_FOUND', 'Organization not found');
      }
      const workspaces = await getOrgWorkspaces(db, org.id);
      return c.json(workspaces);
    }
  )

  // Get workspace by slug
  .get('/workspace', authWorkspace, (c) => {
    const ws = c.get('ws');
    return c.json(ws);
  })

  // Create workspace
  .post(
    '/workspace/new',
    zValidator('json', InsertWorkspaceSchema),
    async (c) => {
      const { db } = c.var;
      const { name, ownerId, ownerType, desc } = c.req.valid('json');
      const workspaces =
        ownerType === 'USER'
          ? await getUserWorkspaces(db, ownerId)
          : await getOrgWorkspaces(db, ownerId);
      const existWs = workspaces.find((w) => w.name === name);
      if (existWs) {
        throw new ApiError(
          'CONFLICT',
          'Workspace with this slug already exists'
        );
      }

      const ws = await createWorkspace(db, {
        name,
        ownerId,
        ownerType,
        desc,
      });

      if (!ws) {
        throw new ApiError(
          'INTERNAL_SERVER_ERROR',
          'Failed to create workspace'
        );
      }

      return c.json({ ws });
    }
  )

  // Delete workspace
  .delete('/workspace/:workspaceId', authWorkspace, async (c) => {
    const { db, wsId, userId } = c.var;
    await setUserDefaultWorkspace(db, { userId, wsId });
    await deleteWorkspace(db, { wsId, userId });
    return c.json({});
  })

  // Update workspace name
  .put(
    '/workspace/:workspaceId/name',
    authWorkspace,
    zValidator('json', UpdateWorkspacerNameSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { workspaceId } = c.req.param();
      const { name } = c.req.valid('json');
      const ws = await updateWorkspaceName(db, {
        wsId: workspaceId,
        name,
        userId,
      });
      if (!ws) {
        throw new ApiError(
          'INTERNAL_SERVER_ERROR',
          'Failed to update workspace slug'
        );
      }
      return c.json(ws);
    }
  )
  // Update workspace avatar
  .put(
    '/workspace/:workspaceId/avatar',
    authWorkspace,
    zValidator('form', UpdateWorkspaceAvatarSchema),
    async (c) => {
      const { db, ws, userId } = c.var;
      const { workspaceId } = c.req.param();
      const { image } = c.req.valid('form');
      const { url } = await storage.upload(`ws-avatars/${generateId()}`, image);
      const newWs = await updateWorkspaceAvatar(db, {
        wsId: workspaceId,
        avatarUrl: url,
        userId,
      });
      c.ctx.waitUntil(
        (async () => {
          if (ws.avatarUrl && isStored(ws.avatarUrl)) {
            await storage.delete(ws.avatarUrl);
          }
        })()
      );
      // revalidatePath("/");
      return c.json(newWs);
    }
  );

export default workspace;
