import { ApiError } from "@/lib/error/error";
import { setSession } from "@/lib/session";
import { isHashValid } from "@/lib/utils";
import { LoginPasswordSchema } from "@/lib/zod/schemas/auth";
import { getUserByUsername, getUserEmail } from "@/server/data-access/user";
import { turnstile } from "@/server/middleware/turnstile";
import type { Context } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const login = new Hono<Context>()
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
