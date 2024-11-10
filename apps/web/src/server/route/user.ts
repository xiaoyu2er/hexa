import { ApiError } from "@/lib/error/error";
import { invalidateUserSessions } from "@/lib/session";
import { isStored, storage } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { OnlyEmailSchema } from "@/lib/zod/schemas/auth";
import {
  ChangeUsernameSchema,
  DeleteOAuthAccountSchema,
  UpdateAvatarSchema,
  UpdateDisplayNameSchema,
} from "@/lib/zod/schemas/user";
import {
  getUserOAuthAccounts,
  removeUserOAuthAccount,
} from "@/server/data-access/account";
import {
  createUserEmail,
  deleteUser,
  getUserByUsername,
  getUserEmails,
  removeUserEmail,
  updateProfileName,
  updateUserAvatar,
  updateUserPrimaryEmail,
  updateUsername,
} from "@/server/data-access/user";
import { setUserDefaultWorkspace } from "@/server/data-access/workspace";
import auth from "@/server/middleware/auth-user";
import authWorkspace from "@/server/middleware/auth-workspace";
import { updatePasscodeAndSendEmail } from "@/server/serverice/passcode";
import type { Context } from "@/server/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const user = new Hono<Context>()
  .use("/user/*", auth)
  // Get user info
  .get("/user/info", async (c) => {
    const { db, user } = c.var;
    // const user = await getUser(db, userId);
    // if (!user) {
    //   throw new ApiError("NOT_FOUND", "User not found");
    // }
    return c.json(user);
  })
  // Get user email
  .get("/user/emails", async (c) => {
    const { db, userId } = c.var;
    const emails = await getUserEmails(db, userId);
    return c.json(emails);
  })
  // Get user oauth accounts
  .get("/user/oauth-accounts", async (c) => {
    const { db, userId } = c.var;
    const oauthAccounts = await getUserOAuthAccounts(db, userId);
    return c.json(oauthAccounts);
  })
  // Set user primary email
  .put(
    "/user/emails/primary",
    zValidator("json", OnlyEmailSchema),
    async (c) => {
      const { email } = c.req.valid("json");
      const { db, userId } = c.var;
      await updateUserPrimaryEmail(db, userId, email);
      return c.json({});
    },
  )
  // Update display name
  .put(
    "/user/display-name",
    zValidator("json", UpdateDisplayNameSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { name } = c.req.valid("json");
      await updateProfileName(db, userId, name);
      return c.json({});
    },
  )
  // Change username
  .put(
    "/user/username",
    zValidator("json", ChangeUsernameSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { username } = c.req.valid("json");
      const existUser = await getUserByUsername(db, username);
      if (existUser) {
        throw new ApiError("CONFLICT", "Username already exists");
      }
      await updateUsername(db, userId, username);
      return c.json({});
    },
  )
  // Add user email
  .post("/user/emails", zValidator("json", OnlyEmailSchema), async (c) => {
    const { db, userId } = c.var;
    const { email } = c.req.valid("json");
    const publicUrl = new URL(c.req.url).origin;

    await createUserEmail(db, {
      email,
      verified: false,
      primary: false,
      userId,
    });

    const data = await updatePasscodeAndSendEmail(db, {
      userId,
      email,
      type: "VERIFY_EMAIL",
      publicUrl,
    });

    return c.json(data);
  })
  // Remove user email
  .delete("/user/emails", zValidator("json", OnlyEmailSchema), async (c) => {
    const { db, userId } = c.var;
    const { email } = c.req.valid("json");
    await removeUserEmail(db, userId, email);
    return c.json({});
  })
  // Update user avatar
  .put("/user/avatar", zValidator("form", UpdateAvatarSchema), async (c) => {
    const {
      db,
      userId,
      user: { avatarUrl },
    } = c.var;
    const { image } = c.req.valid("form");
    const { url } = await storage.upload(`avatars/${generateId()}`, image);
    await updateUserAvatar(db, userId, url);
    // Delete old avatar
    c.executionCtx.waitUntil(
      (async () => {
        if (avatarUrl && isStored(avatarUrl)) {
          await storage.delete(avatarUrl);
        }
      })(),
    );
    // revalidatePath("/");
    return c.json({});
  })
  // Delete user
  .delete("/user", async (c) => {
    const { db, userId } = c.var;
    await deleteUser(db, userId);
    await invalidateUserSessions(userId);
    // setBlankSessionCookie();
    return c.json({});
  })
  // Remove user oauth account
  .delete(
    "/user/oauth-accounts",
    zValidator("json", DeleteOAuthAccountSchema),
    async (c) => {
      const { db, userId } = c.var;
      const { provider } = c.req.valid("json");
      await removeUserOAuthAccount(db, userId, provider);
      return c.json({});
    },
  )
  // Set user default workspace
  .put("/user/default-workspace", authWorkspace, async (c) => {
    const { db, userId, ws } = c.var;
    const newUser = await setUserDefaultWorkspace(db, userId, ws.id);
    if (!newUser) {
      throw new ApiError(
        "INTERNAL_SERVER_ERROR",
        "Failed to set default workspace",
      );
    }
    // revalidatePath("/");
    return c.json(ws);
  });

export default user;
