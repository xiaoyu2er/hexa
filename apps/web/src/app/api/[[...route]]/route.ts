import { Hono } from "hono";
import { cors } from "hono/cors";

import { handle } from "hono/vercel";

import { ApiError, ERROR_CODE_TO_HTTP_STATUS } from "@/lib/error/error";
import db from "@/server/middleware/db";
import error from "@/server/middleware/error";
import test from "@/server/route/test";
import user from "@/server/route/user";
import type { ContextVariables } from "@/server/types";
import { ZSAError } from "zsa";

const app = new Hono<{ Variables: ContextVariables }>()
  .basePath("/api")
  .use(cors())
  .use(error)
  .use(db)
  .route("/test", test)
  .route("/", user)
  .onError((error, c) => {
    if (error instanceof ApiError || error instanceof ZSAError) {
      // @ts-ignore
      const status = ERROR_CODE_TO_HTTP_STATUS[error.code] ?? 500;
      return c.json(
        {
          error: {
            message: error.message,
          },
        },
        status,
      );
    }
    console.log("unexpected error", error);
    throw error;
  });

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
