import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

export default defineConfig({
  schema: './src/server/db/relations.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  // driver: 'd1-http',
  dbCredentials: {
    url: process.env.DB_LOCAL_PATH ?? '',
  },
});
