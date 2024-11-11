import { getDB } from "@/server/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createMiddleware } from "hono/factory";

const setEnv = createMiddleware(async (c, next) => {
  c.set("db", await getDB());
  const { env, cf, ctx } = await getCloudflareContext();
  c.env = env;
  c.req.cf = cf;
  c.ctx = ctx;
  return next();
});

export default setEnv;