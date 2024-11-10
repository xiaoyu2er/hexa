import { DISABLE_CLOUDFLARE_TURNSTILE, PUBLIC_URL } from "@/lib/const";
import type { ContextVariables } from "@/server/types";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Hono } from "hono";

const test = new Hono<{ Variables: ContextVariables }>()
  .get("/hello", async (c) => {
    const { env } = await getCloudflareContext();
    return c.json({
      message: env.hello,
    });
  })
  .get("/env", async (c) => {
    return c.json({
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      PUBLIC_URL,
      DISABLE_CLOUDFLARE_TURNSTILE,
    });
  });

export default test;
