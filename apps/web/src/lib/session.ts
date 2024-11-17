import { validateRequest } from '@/lib/auth';
import { $lucia } from '@/lib/auth/lucia';
import { ApiError } from '@/lib/error/error';
import type { SelectUserType } from '@/server/db';
import { cookies } from 'next/headers';

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

export async function setSession(userId: SelectUserType['id']) {
  const lucia = await $lucia;
  const session = await lucia.createSession(userId, {});
  await setSessionCookie(session.id);
}

export async function invalidateSession(sessionId: string) {
  const lucia = await $lucia;
  await lucia.invalidateSession(sessionId);
}
export async function invalidateUserSessions(userId: SelectUserType['id']) {
  const lucia = await $lucia;
  await lucia.invalidateUserSessions(userId);
}

export async function setBlankSessionCookie() {
  const lucia = await $lucia;
  const sessionCookie = lucia.createBlankSessionCookie();
  const cookie = await cookies();
  cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export async function assertAuthenticated() {
  const { user, session } = await validateRequest();
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
