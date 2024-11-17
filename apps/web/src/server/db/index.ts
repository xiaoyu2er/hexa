import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

import * as schema from './relations';

export const getD1 = async () => {
  const { env } = await getCloudflareContext();
  return env.DB;
};

export const getDb = async () => {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB, {
    schema,
  });
};

export type DbSchema = typeof schema;
