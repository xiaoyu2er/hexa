import { ApiError } from '@/lib/error/error';
import type { ValidTarget } from '@/server/route/route-types';
import { getProjectWithRole } from '@/server/store/project';
import { createMiddleware } from 'hono/factory';

const authProject = (target: ValidTarget) =>
  createMiddleware(async (c, next) => {
    // Get projectId from body or formData
    // @ts-ignore
    const projectId = c.req.valid(target)?.projectId;

    if (!projectId) {
      throw new ApiError('BAD_REQUEST', 'Project ID is required');
    }

    const { db, userId } = c.var;

    const project = await getProjectWithRole(db, projectId, userId);

    if (!project) {
      throw new ApiError('NOT_FOUND', 'Project not found');
    }

    if (!project.role) {
      throw new ApiError('FORBIDDEN', 'You are not a member of this project');
    }

    c.set('project', project);
    c.set('projectId', project.id);

    return next();
  });

export default authProject;
