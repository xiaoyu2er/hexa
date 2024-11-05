import type { UserModel } from "@/lib/db";
import { cookies } from "next/headers";
import { ZSAError } from "zsa";
import { validateRequest } from "./auth";
import { getLucia } from "./auth/lucia";

export async function getSessionId() {
  const lucia = await getLucia();
  return cookies().get(lucia.sessionCookieName)?.value ?? null;
}

// Validates a session with the session ID. Extends the session expiration if in idle state.
export async function validateSession(sessionId: string) {
  const lucia = await getLucia();
  return lucia.validateSession(sessionId);
}

export async function setSessionCookie(sessionId: string) {
  const lucia = await getLucia();
  const sessionCookie = lucia.createSessionCookie(sessionId);
  console.log("setSessionCookie", sessionCookie);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function setSession(userId: UserModel["id"]) {
  const lucia = await getLucia();
  const session = await lucia.createSession(userId, {});
  await setSessionCookie(session.id);
}

export async function invalidateSession(sessionId: string) {
  const lucia = await getLucia();
  await lucia.invalidateSession(sessionId);
}
export async function invalidateUserSessions(userId: UserModel["id"]) {
  const lucia = await getLucia();
  console.log("lucia.invalidateUserSessions", userId);
  await lucia.invalidateUserSessions(userId);
}

export async function setBlankSessionCookie() {
  const lucia = await getLucia();
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function assertAuthenticated() {
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
}
