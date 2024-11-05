import { DISABLE_CLOUDFLARE_TURNSTILE, PUBLIC_URL } from "@/lib/const";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");
app.use("/*", cors());

app
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

export const GET = handle(app);
export const POST = handle(app);
