// @ts-ignore
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

import type { Simplify } from 'type-fest';
import * as schema from './table';

export const getDb = async () => {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB, {
    schema,
  });
  return db;
};

export { schema };
export type DbSchema = Simplify<typeof schema>;
