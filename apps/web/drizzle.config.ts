import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path:
    process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  // driver: "d1",
  dialect: "sqlite",
  dbCredentials: {
    // url: process.env.DB_URL ?? "",
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/3e2bb370d13f89dd177b80bc5184fd5470e46400063f799c2afca3e9cb993f6c.sqlite",
  },
});
