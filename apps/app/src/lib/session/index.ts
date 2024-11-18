'use server';

import { ApiError } from '@/lib/error/error';
import { $lucia } from '@/lib/session/lucia';
import type { Session, User } from 'lucia';
import { cookies } from 'next/headers';
// import { cache } from 'react';

export async function getSessionId() {
  const lucia = await $lucia;
  const cookie = await cookies();
  return cookie.get(lucia.sessionCookieName)?.value ?? null;
}

// Validates a session with the session ID. Extends the session expiration if in idle state.
export async function validateSession(sessionId: string) {
  const lucia = await $lucia;
  return lucia.validateSession(sessionId);
}

export async function setSessionCookie(sessionId: string) {
  const lucia = await $lucia;
  const sessionCookie = lucia.createSessionCookie(sessionId);
  const cookie = await cookies();
  cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export async function setSession(userId: string) {
  const lucia = await $lucia;
  const session = await lucia.createSession(userId, {});
  await setSessionCookie(session.id);
}

export async function invalidateSession(sessionId: string) {
  const lucia = await $lucia;
  await lucia.invalidateSession(sessionId);
}
export async function invalidateUserSessions(userId: string) {
  const lucia = await $lucia;
  await lucia.invalidateUserSessions(userId);
}

export async function setBlankSessionCookie() {
  const lucia = await $lucia;
  const sessionCookie = lucia.createBlankSessionCookie();
  const cookie = await cookies();
  cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

const uncachedGetSession = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return { user: null, session: null };
  }
  const result = await validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    // If Session.fresh is true, it indicates the session expiration has been extended and you should set a new session cookie.
    // see https://lucia-auth.com/basics/sessions
    if (result.session?.fresh) {
      await setSessionCookie(result.session.id);
    }
    if (!result.session) {
      setBlankSessionCookie();
    }
  } catch {
    //
  }
  return result;
};

// export const getSession = cache(uncachedGetSession);
export const getSession = uncachedGetSession;

export async function assertAuthenticated() {
  const { user, session } = await getSession();
  if (!user) {
    throw new ApiError(
      'FORBIDDEN',
      'You must be logged in to access this resource'
    );
  }
  return {
    user,
    session,
  };
}
