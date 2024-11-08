import { ApiError } from "@/lib/error/error";
import { SignupSchema } from "@/lib/zod/schemas/auth";
import {
  createUser,
  getEmail,
  getUserByUsername,
  updateUserPassword,
} from "@/server/data-access/user";
import { turnstile } from "@/server/middleware/turnstile";
import { updateTokenAndSendPasscode } from "@/server/serverice/login";
import type { ContextVariables } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const signup = new Hono<{ Variables: ContextVariables }>()
  // signup
  .post("/signup", zValidator("json", SignupSchema), turnstile, async (c) => {
    const db = c.get("db");
    const { email, password, username } = c.req.valid("json");
    const emailItem = await getEmail(db, email);
    if (emailItem?.verified) {
      throw new ApiError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "[dev]Email already exists"
          : "Email already exists",
      );
    }

    let user = emailItem?.user;
    console.log("user", emailItem, user);

    if (user) {
      await updateUserPassword(db, user.id, password);
    } else {
      user = await getUserByUsername(db, username);
      if (user) {
        throw new ApiError("FORBIDDEN", "Username already exists");
      }
      user = await createUser(db, {
        name: null,
        email,
        verified: false,
        password,
        username,
        avatarUrl: null,
      });

      if (!user) {
        throw new ApiError("INTERNAL_SERVER_ERROR", "Failed to create user");
      }
    }
    const data = await updateTokenAndSendPasscode(
      db,
      user.id,
      email,
      "VERIFY_EMAIL",
    );
    return c.json(data);
  });

export default signup;
