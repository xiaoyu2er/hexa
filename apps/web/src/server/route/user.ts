import { validateRequest } from "@/lib/auth";
import { OnlyEmailSchema } from "@/lib/zod/schemas/auth";
import {
  getUserEmails,
  updateUserPrimaryEmail,
} from "@/server/data-access/user";
import auth from "@/server/middleware/auth";
import type { ContextVariables } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getUserOAuthAccounts } from "../data-access/account";

const user = new Hono<{ Variables: ContextVariables }>()
  .use("/user/*", auth)
  // Get user info
  .get("/user/info", async (c) => {
    const user = c.get("user");
    return c.json(user);
  })
  // Get user email
  .get("/user/emails", async (c) => {
    const user = c.get("user");
    const db = c.get("db");
    const emails = await getUserEmails(db, user.id);
    return c.json(emails);
  })
  // Get user oauth accounts
  .get("/user/oauth-accounts", async (c) => {
    const user = c.get("user");
    const db = c.get("db");
    const oauthAccounts = await getUserOAuthAccounts(db, user.id);
    return c.json(oauthAccounts);
  })
  // Set user primary email
  .post(
    "/user/emails/primary",
    zValidator("json", OnlyEmailSchema),
    async (c) => {
      const { email } = c.req.valid("json");
      const user = c.get("user");
      const db = c.get("db");
      await updateUserPrimaryEmail(db, user.id, email);
      return c.json({});
    },
  );

export default user;
