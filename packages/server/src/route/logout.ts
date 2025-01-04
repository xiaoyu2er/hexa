import { invalidateSession, setBlankSessionCookie } from '@hexa/server/session';
import type { Context } from '@hexa/server/types';

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
