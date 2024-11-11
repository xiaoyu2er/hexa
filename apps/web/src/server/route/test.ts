import {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_STORAGE_BASE_URL,
  NEXT_PUBLIC_STORAGE_ENDPOINT,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} from "@/lib/env";
import type { Context } from "@/server/types";
import { Hono } from "hono";

const test = new Hono<Context>()
  // Get environment variables
  .get("/env", async (c) => {
    const env = c.env;
    const json = [...Object.entries(env)]
      .filter(([, value]) => typeof value === "string")
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );
    return c.json({
      env: json,
      IS_DEVELOPMENT,
      IS_PRODUCTION,
      NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_STORAGE_ENDPOINT,
      NEXT_PUBLIC_STORAGE_BASE_URL,
    });
  });

export default test;
