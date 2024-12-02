import { isAppHost } from '@/lib/check-route-permission';
import { createMiddleware } from 'hono/factory';

// biome-ignore lint/suspicious/useAwait: <explanation>
export const protectApi = createMiddleware(async (c, next) => {
  const host = c.req.header('host');
  if (!host || !isAppHost(host)) {
    return c.redirect('/');
  }
  return next();
});
