import { Hono } from "hono";
import { cors } from "hono/cors";

import { handle } from "hono/vercel";
import test from "./test";
import user from "./user";

const app = new Hono()
  .basePath("/api")
  .use("/*", cors())
  .route("/test", test)
  .route("/", user);

export type AppType = typeof user;

export const GET = handle(app);
export const POST = handle(app);
