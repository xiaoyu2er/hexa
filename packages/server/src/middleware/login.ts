import { ApiError } from '@hexa/lib';
import { invalidateUserSessions, setSession } from '@hexa/server/session';
import { createMiddleware } from 'hono/factory';

export const verifyLoginPasscodeMiddleware = createMiddleware(async (c) => {
  const passcode = c.get('passcode');

  const userId = passcode.user.id;
  await invalidateUserSessions(userId);
  await setSession(userId);

  if (passcode.userId && passcode.user) {
    await invalidateUserSessions(passcode.userId);
    await setSession(passcode.userId);
    return c.redirect('/');
  }

  throw new ApiError('BAD_REQUEST', 'Unexpected token');
});
