import { invalidateSession, setBlankSessionCookie } from '@/lib/session';
import type { Context } from '@/server/route/route-types';

import { assertAuthMiddleware } from '@/server/middleware/user';
import { Hono } from 'hono';

const logout = new Hono<Context>()
  // Logout
  .post('/logout', assertAuthMiddleware, async (c) => {
    const session = c.get('session');
    await invalidateSession(session.id);
    await setBlankSessionCookie();
    return c.json({});
  });

export default logout;
