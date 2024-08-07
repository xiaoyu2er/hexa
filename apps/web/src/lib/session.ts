import type { UserModel } from "@/lib/db";
import { cookies } from "next/headers";
import { ZSAError } from "zsa";
import { lucia, validateRequest } from "./auth";

export function getSessionId() {
  return cookies().get(lucia.sessionCookieName)?.value ?? null;
}

// Validates a session with the session ID. Extends the session expiration if in idle state.
export async function validateSession(sessionId: string) {
  return lucia.validateSession(sessionId);
}

export async function setSessionCookie(sessionId: string) {
  const sessionCookie = lucia.createSessionCookie(sessionId);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function setSession(userId: UserModel["id"]) {
  const session = await lucia.createSession(userId, {});
  await setSessionCookie(session.id);
}

export async function invalidateSession(sessionId: string) {
  await lucia.invalidateSession(sessionId);
}
export async function invalidateUserSessions(userId: UserModel["id"]) {
  await lucia.invalidateUserSessions(userId);
}

export function setBlankSessionCookie() {
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export const assertAuthenticated = async () => {
  const { user, session } = await validateRequest();
  if (!user) {
    throw new ZSAError(
      "FORBIDDEN",
      "You must be logged in to access this resource",
    );
  }
  return {
    user,
    session,
  };
};
