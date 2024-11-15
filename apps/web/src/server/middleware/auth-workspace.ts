import { ApiError } from '@/lib/error/error';
import {
  getWorkspaceBySlug,
  getWorkspaceByWsId,
  getWorkspaceMember,
} from '@/server/data-access/workspace';
import { createMiddleware } from 'hono/factory';
import type { WorkspaceModel } from '../db';

const authWorkspace = createMiddleware(async (c, next) => {
  let { workspaceId, slug } = c.req.param() as {
    workspaceId: string;
    slug: string;
  };
  if (
    !workspaceId &&
    !slug &&
    (c.req.method === 'POST' || c.req.method === 'PUT')
  ) {
    const body = (await c.req.json()) as { workspaceId: string };
    workspaceId = body.workspaceId;
  }

  if (!workspaceId && !slug) {
    throw new ApiError('BAD_REQUEST', 'Workspace ID or slug is required');
  }

  const { db, session } = c.var;

  let ws: WorkspaceModel | undefined;
  if (workspaceId) {
    ws = await getWorkspaceByWsId(db, workspaceId);
  } else {
    ws = await getWorkspaceBySlug(db, slug);
  }
  if (!ws) {
    throw new ApiError('NOT_FOUND', 'Workspace not found');
  }

  const member = await getWorkspaceMember(db, ws.id, session.userId);
  if (!member) {
    throw new ApiError('FORBIDDEN', 'You are not a member of this workspace');
  }

  c.set('ws', ws);
  c.set('wsMember', member);
  return next();
});

export default authWorkspace;
