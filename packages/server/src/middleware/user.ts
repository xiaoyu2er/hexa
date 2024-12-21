import { assertAuthenticated } from '@hexa/server/session';
import { createMiddleware } from 'hono/factory';

export const assertAuthMiddleware = createMiddleware(async (c, next) => {
  const { session, user } = await assertAuthenticated();
  c.set('user', user);
  c.set('session', session);
  c.set('userId', session.userId);
  return next();
});
