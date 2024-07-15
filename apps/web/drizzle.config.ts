import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path:
    process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL ?? "",
  },
});
