import { getDb } from '@/lib/db';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createMiddleware } from 'hono/factory';

const setEnv = createMiddleware(async (c, next) => {
  const db = await getDb();
  c.set('db', db);
  const { env, cf, ctx } = await getCloudflareContext();
  c.env = env;
  // @ts-ignore
  c.req.cf = cf || {};
  c.ctx = ctx;
  return next();
});

export default setEnv;
