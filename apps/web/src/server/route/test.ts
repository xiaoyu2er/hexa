import type { Context } from "@/server/types";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Hono } from "hono";

const test = new Hono<Context>()
  .get("/hello", async (c) => {
    const { env } = await getCloudflareContext();
    return c.json({
      message: env.hello,
    });
  })
  .get("/env", async (c) => {
    return c.json(process.env);
  });

export default test;
