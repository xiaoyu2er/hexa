import type { Context } from '@/lib/route-types';
import { invalidateSession, setBlankSessionCookie } from '@/lib/session';

import { assertAuthMiddleware } from '@/features/user/middleware';
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
