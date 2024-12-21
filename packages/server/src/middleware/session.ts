import { getSession } from '@hexa/server/session';
import { createMiddleware } from 'hono/factory';

export const getSessionMiddleware = createMiddleware(async (c, next) => {
  const { session, user } = await getSession();
  c.set('user', user);
  c.set('session', session);
  c.set('userId', session?.userId);
  return next();
});
