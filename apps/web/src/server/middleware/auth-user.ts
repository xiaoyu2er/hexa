import { assertAuthenticated } from '@/lib/session';
import { createMiddleware } from 'hono/factory';

const auth = createMiddleware(async (c, next) => {
  const { session, user } = await assertAuthenticated();
  c.set('user', user);
  c.set('session', session);
  c.set('userId', session.userId);
  return next();
});

export default auth;
