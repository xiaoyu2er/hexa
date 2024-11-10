import { inspect } from "node:util";
import { ERROR_CODE_TO_HTTP_STATUS } from "@/lib/error/error";
import { IS_DEVELOPMENT } from "@hexa/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./middleware/db";
import login from "./route/login";
import logout from "./route/logout";
import oauth from "./route/oauth";
import passcode from "./route/passcode";
import resetPassword from "./route/reset-password";
import signup from "./route/signup";
import test from "./route/test";
import user from "./route/user";
import workspace from "./route/workspace";
import type { ContextVariables } from "./types";

export const app = new Hono<{ Variables: ContextVariables }>()
  .basePath("/api")
  .use(cors())
  .use(db)
  .route("/", test)
  .route("/", login)
  .route("/", logout)
  .route("/", resetPassword)
  .route("/", signup)
  .route("/", user)
  .route("/", passcode)
  .route("/", oauth)
  .route("/", workspace)
  .onError((error, c) => {
    // @ts-ignore
    const code = error.code;
    if (code) {
      // @ts-ignore
      const status = ERROR_CODE_TO_HTTP_STATUS[code] ?? 500;
      return c.json(
        {
          error: {
            message: error.message,
          },
        },
        status,
      );
    }
    // we need to log this errors
    console.error(error);

    if (IS_DEVELOPMENT) {
      return c.json(
        {
          error: {
            cause: inspect(error, { depth: null }),
            message: error.message,
          },
        },
        500,
      );
    }

    throw error;
  });

export type AppType = typeof app;
