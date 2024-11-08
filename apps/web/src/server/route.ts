import { ERROR_CODE_TO_HTTP_STATUS } from "@/lib/error/error";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ApiError } from "next/dist/server/api-utils";
import { ZSAError } from "zsa";
import db from "./middleware/db";
import login from "./route/login";
import passcode from "./route/passcode";
import resetPassword from "./route/reset-password";
import signup from "./route/signup";
import test from "./route/test";
import user from "./route/user";
import type { ContextVariables } from "./types";

export const app = new Hono<{ Variables: ContextVariables }>()
  .basePath("/api")
  .use(cors())
  .use(db)
  .route("/", test)
  .route("/", login)
  .route("/", resetPassword)
  .route("/", signup)
  .route("/", user)
  .route("/", passcode)
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
    console.log("unexpected error", error);
    throw error;
  });

export type AppType = typeof app;
