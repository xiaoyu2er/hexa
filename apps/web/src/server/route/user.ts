import { validateRequest } from "@/lib/auth";
import type { ContextVariables } from "@/server/types";
import { Hono } from "hono";

const user = new Hono<{ Variables: ContextVariables }>()
  .use("/me", async (c, next) => {
    const { user } = await validateRequest();
    if (!user) {
      return c.json(
        { error: "You must be logged in to access this resource" },
        403,
      );
    }
    return next();
  })
  .get("/me", async (c) => {
    const { user } = await validateRequest();
    return c.json({ user });
  });

export default user;
