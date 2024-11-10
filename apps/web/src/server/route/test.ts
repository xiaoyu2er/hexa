import type { Context } from "@/server/types";
import {
  CLOUDFLARE_TURNSTILE_SECRET_KEY,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  RESEND_API_KEY,
  STORAGE_ACCESS_KEY_ID,
  STORAGE_BASE_URL,
  STORAGE_ENDPOINT,
  STORAGE_SECRET_ACCESS_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from "@hexa/env";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Hono } from "hono";

const test = new Hono<Context>()
  // Get environment variables
  .get("/env", async (c) => {
    const { env } = await getCloudflareContext();
    return c.json({
      hello: env.hello,
      IS_PRODUCTION,
      IS_DEVELOPMENT,
      NEXT_PUBLIC_APP_NAME,
      RESEND_API_KEY,
      GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
      CLOUDFLARE_TURNSTILE_SECRET_KEY,
      STORAGE_ACCESS_KEY_ID,
      STORAGE_SECRET_ACCESS_KEY,
      STORAGE_ENDPOINT,
      STORAGE_BASE_URL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET,
    });
  });

export default test;
