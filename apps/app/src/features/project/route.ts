import authProject from '@/features/project/middleware';
import {
  DeleteProjectSchema,
  InsertProjectSchema,
  ProjectIdSchema,
  UpdateProjectAvatarSchema,
  UpdateProjectSlugSchema,
  UpdateProjectrNameSchema,
} from '@/features/project/schema';
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  getUserAccessibleProjects,
  setUserDefaultProject,
  updateProjectAvatar,
  updateProjectName,
  updateProjectSlug,
} from '@/features/project/store';
import { assertAuthMiddleware } from '@/features/user/middleware';
import { generateId } from '@/lib/crypto';
import { ApiError } from '@/lib/error/error';
import type { Context } from '@/lib/route-types';
import { isStored, storage } from '@/lib/storage';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const project = new Hono<Context>()
  // Get all workspaces
  .use('/project/*', assertAuthMiddleware)
  .get('/project/all', async (c) => {
    const { db, userId } = c.var;
    const projects = await getUserAccessibleProjects(db, userId);
    return c.json(projects);
  })

  // Create workspace
  .post(
    '/project/create-project',
    zValidator('json', InsertProjectSchema),
    async (c) => {
      const { db } = c.var;
      const { name, orgId, desc, slug } = c.req.valid('json');
      const existingProject = await getProjectBySlug(db, { slug });
      if (existingProject) {
        throw new ApiError('CONFLICT', 'Project with this slug already exists');
      }

      const project = await createProject(db, {
        name,
        orgId,
        desc,
        slug,
      });

      return c.json({ project });
    }
  )
  .get(
    '/project/:projectId',
    zValidator('param', ProjectIdSchema),
    authProject('param'),
    (c) => {
      const { project } = c.var;
      return c.json(project);
    }
  )

  // Delete workspace
  .delete(
    '/project/delete-project',
    zValidator('json', DeleteProjectSchema),
    authProject('json'),
    async (c) => {
      const { db, projectId, userId } = c.var;
      await setUserDefaultProject(db, { userId, projectId });
      await deleteProject(db, { projectId, userId });
      return c.json({});
    }
  )

  // Update workspace name
  .put(
    '/project/update-project-name',
    zValidator('json', UpdateProjectrNameSchema),
    authProject('json'),
    async (c) => {
      const { db, userId, projectId } = c.var;
      const { name } = c.req.valid('json');
      const project = await updateProjectName(db, {
        projectId: projectId,
        name,
        userId,
      });
      if (!project) {
        throw new ApiError(
          'INTERNAL_SERVER_ERROR',
          'Failed to update workspace slug'
        );
      }
      return c.json(project);
    }
  )
  // Update workspace slug
  .put(
    '/project/update-project-slug',
    zValidator('json', UpdateProjectSlugSchema),
    authProject('json'),
    async (c) => {
      const { db, projectId, userId } = c.var;
      const { slug } = c.req.valid('json');
      const project = await updateProjectSlug(db, {
        projectId,
        slug,
        userId,
      });
      return c.json(project);
    }
  )
  // Update workspace avatar
  .put(
    '/project/update-project-avatar',
    zValidator('form', UpdateProjectAvatarSchema),
    authProject('form'),
    async (c) => {
      const { db, project, userId, projectId } = c.var;
      const { image } = c.req.valid('form');
      const { url } = await storage.upload(
        `project-avatars/${generateId()}`,
        image
      );
      const newWs = await updateProjectAvatar(db, {
        projectId: projectId,
        avatarUrl: url,
        userId,
      });
      c.ctx.waitUntil(
        (async () => {
          if (project.avatarUrl && isStored(project.avatarUrl)) {
            await storage.delete(project.avatarUrl);
          }
        })()
      );
      // revalidatePath("/");
      return c.json(newWs);
    }
  );

export default project;
