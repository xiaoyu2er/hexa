import { ApiError } from '@hexa/lib';
import authProject from '@hexa/server/middleware/project';
import type { Context } from '@hexa/server/route/route-types';
import { TagQuerySchema, UpdateTagSchema } from '@hexa/server/schema/tag';
import { InsertTagSchema } from '@hexa/server/schema/tag';
import { ProjectIdSchema } from '@hexa/server/schema/project';
import {
  createTag,
  getTagById,
  getTags,
  updateTag,
} from '@hexa/server/store/tag';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const tag = new Hono<Context>()
  .get(
    '/project/:projectId/tags',
    zValidator('param', ProjectIdSchema),
    zValidator('query', TagQuerySchema),
    authProject('param'),
    async (c) => {
      const { db } = c.var;
      const projectId = c.req.param('projectId');
      const query = c.req.valid('query');
      const tags = await getTags(db, projectId, query);
      return c.json(tags);
    }
  )
  .post( 
    '/tag/create-tag',
    zValidator('json', InsertTagSchema),
    async (c) => {
      const { db } = c.var;
      const json = c.req.valid('json');
      const tag = await createTag(db, {
        ...json,
      });

      if (!tag) {
        throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create tag');
      }
      return c.json(tag);
    }
  )
  // .put('/tag/update-tag', zValidator('json', UpdateTagSchema), async (c) => {
  //   const { db } = c.var;

  //   const json = c.req.valid('json');
  //   const tag = await updateTag(db, {
  //     ...json,
  //     id: json.id ?? '',
  //   });
  //   // Store the URL in the KV store
  //   const value = await getTagById(db, tag.id);
  //   const key = `${tag.domain}/${tag.slug}`;
  //   await c.env.APP_KV.put(key, JSON.stringify(value));
  //   return c.json(tag);
  // })
  // .get('/tag/:tagId', async (c) => {
  //   const { db } = c.var;
  //   const tagId = c.req.param('tagId');
  //   const url = await getTagById(db, tagId);
  //   return c.json(url);
  // });

export default tag;
