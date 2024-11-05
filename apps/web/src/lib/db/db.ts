import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export const getDB = async () => {
  const { env } = await getCloudflareContext();
  return env.DB;
};

export const getDrizzle = async () => {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB, { schema });
};
