import type { Session, User } from "lucia";
import { cache } from "react";
import {
  getSessionId,
  setBlankSessionCookie,
  setSessionCookie,
  validateSession,
} from "../session";

const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return { user: null, session: null };
  }
  console.log("sessionId", sessionId);
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
    console.error("Failed to set session cookie");
  }
  return result;
};

export const validateRequest = cache(uncachedValidateRequest);
