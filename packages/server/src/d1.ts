// @ts-ignore
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const getD1 = async () => {
  const { env } = await getCloudflareContext();
  return env.DB;
};
