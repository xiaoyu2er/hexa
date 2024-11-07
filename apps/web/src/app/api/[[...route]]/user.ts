import {
  getUserEmailOrThrowError,
  updateTokenAndSendPasscode,
} from "@/lib/actions/login";
import { updateTokenAndSendVerifyEmail } from "@/lib/actions/sign-up";
import { validateRequest } from "@/lib/auth";
import { invalidateUserSessions, setSession } from "@/lib/session";
import { isHashValid } from "@/lib/utils";
import {
  LoginPasscodeSchema,
  LoginPasswordSchema,
  OTPSchema,
} from "@/lib/zod/schemas/auth";
import { verifyDBTokenByCode } from "@/server/db/data-access/token";
import { getUserByUsername, getUserEmail } from "@/server/db/data-access/user";
import type { ContextVariables } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ZSAError } from "zsa";
import { turnstile } from "./turnstile";

const user = new Hono<{ Variables: ContextVariables }>()
  .use("/me", async (c, next) => {
    const { user } = await validateRequest();
    if (!user) {
      return c.json(
        { error: "You must be logged in to access this resource" },
        403,
      );
    }
    return next();
  })
  .get("/me", async (c) => {
    const { user } = await validateRequest();
    return c.json({ user });
  })
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
          throw new ZSAError(
            "FORBIDDEN",
            process.env.NODE_ENV === "development"
              ? "[dev] Incorrect email or password"
              : "Incorrect email or password",
          );
        }
      }

      if (!existingUser.password) {
        throw new ZSAError(
          "FORBIDDEN",
          process.env.NODE_ENV === "development"
            ? "[dev] Password is not set"
            : "Incorrect email or password",
        );
      }

      const validPassword = await isHashValid(existingUser.password, password);

      if (!validPassword) {
        throw new ZSAError(
          "FORBIDDEN",
          process.env.NODE_ENV === "development"
            ? "[dev] Incorrect password"
            : "Incorrect email or password",
        );
      }

      await setSession(existingUser.id);

      return c.json({ user: existingUser });
    },
  )
  .post(
    "/login-passcode",
    zValidator("json", LoginPasscodeSchema),
    turnstile,
    async (c) => {
      const db = c.get("db");
      const { email } = c.req.valid("json");
      const {
        user: { id: userId },
      } = await getUserEmailOrThrowError(db, email);
      const data = await updateTokenAndSendPasscode(
        db,
        userId,
        email,
        "LOGIN_PASSCODE",
      );
      return c.json(data);
    },
  )
  .post(
    "/resend-passcode",
    zValidator("json", LoginPasscodeSchema.pick({ email: true })),
    async (c) => {
      const db = c.get("db");
      const { email } = c.req.valid("json");
      const {
        user: { id: userId },
      } = await getUserEmailOrThrowError(db, email);
      const data = await updateTokenAndSendPasscode(
        db,
        userId,
        email,
        "LOGIN_PASSCODE",
      );
      return c.json(data);
    },
  )
  .post("/verify-login-passcode", zValidator("json", OTPSchema), async (c) => {
    const db = c.get("db");
    const { email, code } = c.req.valid("json");
    const {
      user: { id: userId },
    } = await getUserEmailOrThrowError(db, email);
    const tokenItem = await verifyDBTokenByCode(
      db,
      userId,
      { code },
      "LOGIN_PASSCODE",
      true,
    );
    await invalidateUserSessions(tokenItem.userId);
    await setSession(tokenItem.userId);
    return c.json({}, 200);
  });
export default user;
