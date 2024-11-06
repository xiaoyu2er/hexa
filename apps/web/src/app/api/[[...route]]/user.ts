import { validateRequest } from "@/lib/auth";
import { getUserByUsername, getUserEmail } from "@/lib/db/data-access/user";
import { setSession } from "@/lib/session";
import { isHashValid } from "@/lib/utils";
import {
  LoginPasscodeSchema,
  LoginPasswordSchema,
} from "@/lib/zod/schemas/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
// import { redirect } from "next/navigation";
import { ZSAError } from "zsa";
import { turnstile } from "./turnstile";

const user = new Hono()
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
    "/login",
    zValidator("form", LoginPasswordSchema),
    turnstile,
    async (c) => {
      const { username, password } = c.req.valid("form");
      console.log("username", username);
      let existingUser = await getUserByUsername(username);
      if (!existingUser) {
        const emailItem = await getUserEmail(username);
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
  );
export default user;
