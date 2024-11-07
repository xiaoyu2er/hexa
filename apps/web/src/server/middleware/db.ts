import { getDB } from "@/server/db";
import { createMiddleware } from "hono/factory";

const db = createMiddleware(async (c, next) => {
  c.set("db", await getDB());
  return next();
});

export default db;
