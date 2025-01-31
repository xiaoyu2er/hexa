import {
  APP_URL,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_STORAGE_BASE_URL,
  NEXT_PUBLIC_STORAGE_ENDPOINT,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} from '@hexa/env';
import { generateId } from '@hexa/lib';
import { addTmpUser, deleteTmpUser } from '@hexa/server/store/tmp-user';
import type { Context } from '@hexa/server/types';
import { Hono } from 'hono';

const test = new Hono<Context>()
  .get('/check-health', async (c) => {
    const db = c.get('db');
    // create tmp user and delete it
    const user = await addTmpUser(db, {
      email: `${generateId('tmpu')}@test.com`,
    });
    await deleteTmpUser(db, user.id);
    return c.json({ success: true });
  })
  // Get environment variables
  .get('/env', async (c) => {
    const env = c.env;
    const json = [...Object.entries(env)]
      .filter(([, value]) => typeof value === 'string')
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );
    return c.json({
      env: json,
      process: process.env,
      IS_DEVELOPMENT,
      IS_PRODUCTION,
      NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_STORAGE_ENDPOINT,
      NEXT_PUBLIC_STORAGE_BASE_URL,
      APP_URL,
    });
  });

export default test;
