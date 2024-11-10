import { invalidateSession, setBlankSessionCookie } from "@/lib/session";
import type { Context } from "@/server/types";

import auth from "@/server/middleware/auth-user";
import { Hono } from "hono";

const logout = new Hono<Context>()
  // Logout
  .post("/logout", auth, async (c) => {
    const session = c.get("session");
    await invalidateSession(session.id);
    await setBlankSessionCookie();
    return c.json({});
  });

export default logout;
