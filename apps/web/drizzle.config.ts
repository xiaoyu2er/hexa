import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path:
    process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

console.log("process.env.DB_LOCAL_PATH", process.env.DB_LOCAL_PATH);
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_LOCAL_PATH ?? "",
  },
});
