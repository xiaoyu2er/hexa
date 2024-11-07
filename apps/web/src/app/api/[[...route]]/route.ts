import { Hono } from "hono";
import { cors } from "hono/cors";

import { handle } from "hono/vercel";

import { getDB } from "@/server/db";
import type { ContextVariables } from "@/server/types";
import test from "./test";
import user from "./user";

const app = new Hono<{ Variables: ContextVariables }>()
  .basePath("/api")
  .use(cors())
  .use(async (c, next) => {
    c.set("db", await getDB());
    return next();
  })
  .route("/test", test)
  .route("/", user);

export type AppType = typeof user;

export const GET = handle(app);
export const POST = handle(app);
