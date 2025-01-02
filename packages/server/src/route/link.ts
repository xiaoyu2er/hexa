import { ApiError } from '@hexa/lib';
import authProject from '@hexa/server/middleware/project';
import { LinkQuerySchema, UpdateLinkSchema } from '@hexa/server/schema/link';
import { InsertLinkSchema } from '@hexa/server/schema/link';
import { ProjectIdSchema } from '@hexa/server/schema/project';
import {
  createLink,
  getLinkById,
  getLinks,
  updateLink,
} from '@hexa/server/store/link';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const link = new Hono<Context>()

  .get(
    '/project/:projectId/links',
    zValidator('param', ProjectIdSchema),
    zValidator('query', LinkQuerySchema),
    authProject('param'),
    async (c) => {
      const { db } = c.var;
      const projectId = c.req.param('projectId');
      const query = c.req.valid('query');
      const urls = await getLinks(db, projectId, query);
      return c.json(urls);
    }
  )
  .post(
    '/link/create-link',
    zValidator('json', InsertLinkSchema),
    async (c) => {
      const { db } = c.var;
      const json = c.req.valid('json');
      const link = await createLink(db, {
        ...json,
      });

      if (!link) {
        throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to create URL');
      }
      const uid = link.id;
      const value = await getLinkById(db, uid);
      // Store the URL in the KV store
      const key = `${link.domain}/${link.slug}`;
      await c.env.APP_KV.put(key, JSON.stringify(value));
      return c.json(link);
    }
  )
  .put('/link/update-link', zValidator('json', UpdateLinkSchema), async (c) => {
    const { db } = c.var;

    const json = c.req.valid('json');
    const link = await updateLink(db, {
      ...json,
      id: json.id ?? '',
    });
    // Store the URL in the KV store
    const value = await getLinkById(db, link.id);
    const key = `${link.domain}/${link.slug}`;
    await c.env.APP_KV.put(key, JSON.stringify(value));
    return c.json(link);
  })
  .get('/link/:linkId', async (c) => {
    const { db } = c.var;
    const linkId = c.req.param('linkId');
    const url = await getLinkById(db, linkId);
    return c.json(url);
  });

export default link;
