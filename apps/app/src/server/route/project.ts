import { generateId } from '@/lib/crypto';
import { ApiError } from '@/lib/error/error';
import { isStored, storage } from '@/lib/storage';
import authProject from '@/server/middleware/project';
import type { Context } from '@/server/route/route-types';
import {
  DeleteProjectSchema,
  InsertProjectSchema,
  ProjectIdSchema,
  UpdateProjectAvatarSchema,
  UpdateProjectSlugSchema,
  UpdateProjectrNameSchema,
} from '@/server/schema/project';
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  getUserAccessibleProjects,
  setUserDefaultProject,
  updateProjectAvatar,
  updateProjectName,
  updateProjectSlug,
} from '@/server/store/project';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const project = new Hono<Context>()
  // Get all projects
  .get('/project/all', async (c) => {
    const { db, userId } = c.var;
    const projects = await getUserAccessibleProjects(db, userId);
    return c.json(projects);
  })

  // Create project
  .post(
    '/project/create-project',
    zValidator('json', InsertProjectSchema),
    authProject('json', ['OWNER', 'ADMIN']),
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
  // Delete project
  .delete(
    '/project/delete-project',
    zValidator('json', DeleteProjectSchema),
    authProject('json', ['OWNER', 'ADMIN']),
    async (c) => {
      const { db, projectId, userId } = c.var;
      await setUserDefaultProject(db, { userId, projectId });
      await deleteProject(db, { projectId, userId });
      return c.json({});
    }
  )
  // Update project name
  .put(
    '/project/update-project-name',
    zValidator('json', UpdateProjectrNameSchema),
    authProject('json', ['OWNER', 'ADMIN']),
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
          'Failed to update project slug'
        );
      }
      return c.json(project);
    }
  )
  // Update project slug
  .put(
    '/project/update-project-slug',
    zValidator('json', UpdateProjectSlugSchema),
    authProject('json', ['OWNER', 'ADMIN']),
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
  // Update project avatar
  .put(
    '/project/update-project-avatar',
    zValidator('form', UpdateProjectAvatarSchema),
    authProject('form', ['OWNER', 'ADMIN']),
    async (c) => {
      const { db, project, projectId } = c.var;
      const { image } = c.req.valid('form');
      const { url } = await storage.upload(
        `project-avatars/${generateId()}`,
        image
      );
      const newProject = await updateProjectAvatar(db, {
        projectId: projectId,
        avatarUrl: url,
      });
      if (!newProject) {
        throw new ApiError(
          'INTERNAL_SERVER_ERROR',
          'Failed to update project avatar'
        );
      }
      c.ctx.waitUntil(
        (async () => {
          if (project.avatarUrl && isStored(project.avatarUrl)) {
            await storage.delete(project.avatarUrl);
          }
        })()
      );

      return c.json(newProject);
    }
  );

export default project;
