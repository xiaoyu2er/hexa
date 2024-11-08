import { invalidateSession, setBlankSessionCookie } from "@/lib/session";
import type { ContextVariables } from "@/server/types";

import auth from "@/server/middleware/auth";
import { Hono } from "hono";

const logout = new Hono<{ Variables: ContextVariables }>()
  // Logout
  .post("/logout", auth, async (c) => {
    const session = c.get("session");
    await invalidateSession(session.id);
    await setBlankSessionCookie();
    return c.redirect("/");
  });

export default logout;
