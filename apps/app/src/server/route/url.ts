import authProject from '@/server/middleware/project';
import { assertAuthMiddleware } from '@/server/middleware/user';
import type { Context } from '@/server/route/route-types';
import { ProjectIdSchema } from '@/server/schema/project';
import { UrlQuerySchema } from '@/server/schema/url';
import { InsertUrlSchema } from '@/server/schema/url';
import { createUrl, getUrlById, getUrls, updateUrl } from '@/server/store/url';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const url = new Hono<Context>()
  .use('/url', assertAuthMiddleware)
  .get(
    '/project/:projectId/urls',
    zValidator('param', ProjectIdSchema),
    zValidator('query', UrlQuerySchema),
    authProject('param'),
    async (c) => {
      const { db } = c.var;
      const projectId = c.req.param('projectId');
      const query = c.req.valid('query');
      const urls = await getUrls(db, projectId, query);
      return c.json(urls);
    }
  )
  .post('/url/create-url', zValidator('json', InsertUrlSchema), async (c) => {
    const { db } = c.var;
    const json = c.req.valid('json');
    const url = await createUrl(db, {
      ...json,
    });
    return c.json(url);
  })
  .put('/url/update-url', zValidator('json', InsertUrlSchema), async (c) => {
    const { db } = c.var;

    const json = c.req.valid('json');
    const url = await updateUrl(db, {
      ...json,
      id: json.id ?? '',
    });
    return c.json(url);
  })
  .get('/url/:urlId', async (c) => {
    const { db } = c.var;
    const urlId = c.req.param('urlId');
    const url = await getUrlById(db, urlId);
    return c.json(url);
  });

export default url;