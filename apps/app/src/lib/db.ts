import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

import * as schema from '@/server/table';
import type { Simplify } from 'type-fest';

export const getD1 = async () => {
  const { env } = await getCloudflareContext();
  return env.DB;
};

export const getDb = async () => {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB, {
    schema,
  });
  return db;
};

export { schema };
export type DbSchema = Simplify<typeof schema>;
