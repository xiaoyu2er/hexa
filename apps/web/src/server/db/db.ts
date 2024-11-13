import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as schema from './schema';

export const getD1 = async () => {
  const { env } = await getCloudflareContext();
  return env.DB;
};
export const getDb = async () => {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB, { schema });
};
