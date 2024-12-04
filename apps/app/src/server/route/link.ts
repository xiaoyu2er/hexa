import { ApiError } from '@/lib/error/error';
import authProject from '@/server/middleware/project';
import type { Context } from '@/server/route/route-types';
import { LinkQuerySchema } from '@/server/schema/link';
import { InsertLinkSchema } from '@/server/schema/link';
import { ProjectIdSchema } from '@/server/schema/project';
import {
  createLink,
  getLinks,
  getUrlById,
  updateLink,
} from '@/server/store/link';
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
      const value = await getUrlById(db, uid);
      // Store the URL in the KV store
      const key = `${link.domain}/${link.slug}`;
      await c.env.APP_KV.put(key, JSON.stringify(value));
      return c.json(link);
    }
  )
  .put('/link/update-link', zValidator('json', InsertLinkSchema), async (c) => {
    const { db } = c.var;

    const json = c.req.valid('json');
    const link = await updateLink(db, {
      ...json,
      id: json.id ?? '',
    });
    // Store the URL in the KV store
    const value = await getUrlById(db, link.id);
    const key = `${link.domain}/${link.slug}`;
    await c.env.APP_KV.put(key, JSON.stringify(value));
    return c.json(link);
  })
  .get('/link/:linkId', async (c) => {
    const { db } = c.var;
    const linkId = c.req.param('linkId');
    const url = await getUrlById(db, linkId);
    return c.json(url);
  });

export default link;
