import type { Context } from '@hexa/server/route/route-types';
import { invalidateSession, setBlankSessionCookie } from '@hexa/server/session';

import { assertAuthMiddleware } from '@hexa/server/middleware/user';
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
