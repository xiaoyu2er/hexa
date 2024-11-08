import { getDB } from "@/server/db";
import { createMiddleware } from "hono/factory";

const error = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error("!!", err);

    if (err instanceof Error) {
      return c.json({ error: err.message }, 500);
    }
    return c.json({ error: "An error occurred" }, 500);
  }
});

export default error;
