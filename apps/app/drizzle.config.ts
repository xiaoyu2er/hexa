import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : // biome-ignore lint/nursery/noNestedTernary: <explanation>
        // @ts-ignore
        process.env.NODE_ENV === 'staging'
        ? '.env.staging'
        : '.env',
});

const isLocal = process.env.DB_LOCAL_PATH !== undefined;

const drizzle = isLocal
  ? defineConfig({
      schema: './src/schema.ts',
      out: './drizzle/migrations',
      dialect: 'sqlite',
      // driver: 'd1-http',
      dbCredentials: {
        url: process.env.DB_LOCAL_PATH ?? '',
      },
    })
  : defineConfig({
      schema: './src/schema.ts',
      out: './drizzle/migrations',
      dialect: 'sqlite',
      driver: 'd1-http',
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
        databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? '',
        token: process.env.CLOUDFLARE_D1_TOKEN ?? '',
      },
    });

export default drizzle;
