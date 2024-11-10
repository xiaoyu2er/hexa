import { ApiError } from "@/lib/error/error";
import { invalidateUserSessions, setSession } from "@/lib/session";
import {
  ResendPasscodeSchema,
  SendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from "@/lib/zod/schemas/auth";
import {
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/server/data-access/token";
import { getUserEmailOrThrowError } from "@/server/data-access/user";
import { turnstile } from "@/server/middleware/turnstile";
import { updatePasscodeAndSendEmail } from "@/server/serverice/passcode";
import type { Context } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const passcode = new Hono<Context>()
  // Send passcode
  .post(
    "/send-passcode",
    zValidator("json", SendPasscodeSchema),
    turnstile,
    async (c) => {
      const db = c.get("db");
      const { email, type } = c.req.valid("json");
      const publicUrl = new URL(c.req.url).origin;
      const {
        user: { id: userId },
      } = await getUserEmailOrThrowError(db, email);
      const data = await updatePasscodeAndSendEmail(db, {
        userId,
        email,
        type,
        publicUrl,
      });
      return c.json(data);
    },
  )
  // Resend passcode
  .post(
    "/resend-passcode",
    zValidator("json", ResendPasscodeSchema),
    async (c) => {
      const db = c.get("db");
      const { email, type } = c.req.valid("json");
      const publicUrl = new URL(c.req.url).origin;
      const {
        user: { id: userId },
      } = await getUserEmailOrThrowError(db, email);
      const data = await updatePasscodeAndSendEmail(db, {
        userId,
        email,
        type,
        publicUrl,
      });
      return c.json(data);
    },
  )
  // Login by verify passcode sent to email
  .post(
    "/verify-passcode",
    zValidator("json", VerifyPasscodeSchema),
    async (c) => {
      const db = c.get("db");
      const { email, code, type } = c.req.valid("json");
      const {
        user: { id: userId },
      } = await getUserEmailOrThrowError(db, email);
      const isResetPassword = type === "RESET_PASSWORD";
      const tokenItem = await verifyDBTokenByCode(db, {
        userId,
        code,
        type,
        deleteRow: !isResetPassword,
      });
      // we don't need to invalidate session if it's reset password
      if (!isResetPassword) {
        await invalidateUserSessions(tokenItem.userId);
        await setSession(tokenItem.userId);
      }
      return c.json({ token: tokenItem.token });
    },
  )
  // Login by verify token sent to email
  .get(
    "/verify-token",
    zValidator("query", VerifyPassTokenSchema),
    async (c) => {
      const db = c.get("db");
      const { token, type } = c.req.valid("query");

      const tokenItem = await getTokenByToken(db, token, type);
      if (!tokenItem) {
        throw new ApiError(
          "FORBIDDEN",
          process.env.NODE_ENV === "development"
            ? "[dev]Code is not found"
            : "Code is invalid or expired",
        );
      }
      const isResetPassword = type === "RESET_PASSWORD";

      await verifyDBTokenByCode(db, {
        userId: tokenItem.userId,
        token,
        type: tokenItem.type,
        deleteRow: !isResetPassword,
      });

      if (!isResetPassword) {
        await invalidateUserSessions(tokenItem.userId);
        await setSession(tokenItem.userId);
        return c.redirect("/settings");
      }

      return c.redirect(`/reset-password?token=${tokenItem.token}`);
    },
  );
export default passcode;
