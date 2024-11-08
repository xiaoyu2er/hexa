import { assertAuthenticated } from "@/lib/session";
import { createMiddleware } from "hono/factory";

const auth = createMiddleware(async (c, next) => {
  const { user, session } = await assertAuthenticated();
  c.set("user", user);
  c.set("session", session);
  return next();
});

export default auth;
