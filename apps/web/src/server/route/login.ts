import { validateRequest } from "@/lib/auth";
import { ApiError } from "@/lib/error/error";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { isHashValid } from "@/lib/utils";
import {
  LoginPasswordSchema,
  ResendPasscodeSchema,
  ResetPasswordSchema,
  SendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from "@/lib/zod/schemas/auth";
import {
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/server/data-access/token";
import {
  getUserByUsername,
  getUserEmail,
  updateUserPassword,
} from "@/server/data-access/user";
import { turnstile } from "@/server/middleware/turnstile";
import {
  getUserEmailOrThrowError,
  updateTokenAndSendPasscode,
} from "@/server/serverice/login";
import type { ContextVariables } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const login = new Hono<{ Variables: ContextVariables }>()
  // Login by password
  .post(
    "/login-password",
    zValidator("json", LoginPasswordSchema),
    turnstile,
    async (c) => {
      const { username, password } = c.req.valid("json");
      const db = c.get("db");
      console.log("username", username);
      let existingUser = await getUserByUsername(db, username);
      if (!existingUser) {
        const emailItem = await getUserEmail(db, username);
        existingUser = emailItem?.user;

        if (!existingUser) {
          throw new ApiError(
            "FORBIDDEN",
            process.env.NODE_ENV === "development"
              ? "[dev] Incorrect email or password"
              : "Incorrect email or password",
          );
        }
      }

      if (!existingUser.password) {
        throw new ApiError(
          "FORBIDDEN",
          process.env.NODE_ENV === "development"
            ? "[dev] Password is not set"
            : "Incorrect email or password",
        );
      }

      const validPassword = await isHashValid(existingUser.password, password);

      if (!validPassword) {
        throw new ApiError(
          "FORBIDDEN",
          process.env.NODE_ENV === "development"
            ? "[dev] Incorrect password"
            : "Incorrect email or password",
        );
      }

      await setSession(existingUser.id);

      return c.json({});
    },
  );

export default login;
