import { invalidateSession, setBlankSessionCookie } from '@/lib/session';
import type { Context } from '@/lib/types';

import auth from '@/features/user/middleware';
import { Hono } from 'hono';

const logout = new Hono<Context>()
  // Logout
  .post('/logout', auth, async (c) => {
    const session = c.get('session');
    await invalidateSession(session.id);
    await setBlankSessionCookie();
    return c.json({});
  });

export default logout;
