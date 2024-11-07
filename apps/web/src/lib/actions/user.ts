"use server";

import {
  ChangeUsernameSchema,
  DeleteOAuthAccountSchema,
  DeleteUserSchema,
  UpdateAvatarSchema,
  UpdateUserNameSchema,
} from "@/lib/zod/schemas/user";
import { type ProviderType, getDB } from "@/server/db";
import {
  getUserOAuthAccounts,
  removeUserOAuthAccount,
} from "@/server/db/data-access/account";
import {
  getTokenByToken,
  verifyDBTokenByCode,
} from "@/server/db/data-access/token";
import {
  createUserEmail,
  deleteUser,
  getUserEmails,
  removeUserEmail,
  updateProfileName,
  updateUserAvatar,
  updateUserEmailVerified,
  updateUserPrimaryEmail,
  updateUsername,
} from "@/server/db/data-access/user";
import { waitUntil } from "@vercel/functions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ZSAError,
  createServerAction,
  type inferServerActionReturnTypeHot,
} from "zsa";
import { validateRequest } from "../auth";
import {
  invalidateUserSessions,
  setBlankSessionCookie,
  setSession,
} from "../session";
import { isStored, storage } from "../storage";
import { generateId } from "../utils";
import {
  OTPSchema,
  OnlyEmailSchema,
  OnlyTokenSchema,
} from "../zod/schemas/auth";
import { authenticatedProcedure, getUserEmailProcedure } from "./procedures";
import { updateTokenAndSendVerifyEmail } from "./sign-up";

export const getUserAction = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    return {
      user,
    };
  });

export const updateUserNameAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateUserNameSchema)
  .handler(async ({ input, ctx }) => {
    const { name } = input;
    const { user } = ctx;
    const db = await getDB();
    await updateProfileName(db, user.id, name);
    revalidatePath("/");
  });

export const getUserEmailsAction = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDB();
    const emails = await getUserEmails(db, user.id);
    return {
      emails,
    };
  });

export const addUserEmailAction = authenticatedProcedure
  .createServerAction()
  .input(OnlyEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { email } = input;
    const { user } = ctx;
    const db = await getDB();
    await createUserEmail(db, {
      email,
      verified: false,
      primary: false,
      userId: user.id,
    });

    return await updateTokenAndSendVerifyEmail(user.id, email);
  });

export const setUserPrimaryEmailAction = authenticatedProcedure
  .createServerAction()
  .input(OnlyEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { email } = input;
    const { user } = ctx;
    const db = await getDB();
    await updateUserPrimaryEmail(db, user.id, email);
  });

export const removeUserEmailAction = authenticatedProcedure
  .createServerAction()
  .input(OnlyEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { email } = input;
    const { user } = ctx;
    const db = await getDB();
    await removeUserEmail(db, user.id, email);
  });

export const verifyEmailByCodeAction = getUserEmailProcedure
  .createServerAction()
  .input(OTPSchema)
  .handler(async ({ input, ctx }) => {
    const { code } = input;
    const {
      email: {
        user: { id: userId },
      },
    } = ctx;

    const tokenItem = await verifyDBTokenByCode(
      userId,
      { code },
      "VERIFY_EMAIL",
      true,
    );

    const { user } = await validateRequest();
    console.log("user", user);
    const db = await getDB();
    await updateUserEmailVerified(db, tokenItem.userId, tokenItem.email);
    console.log("0~afterVerifyEmailByCode", tokenItem.userId);
    if (!user) {
      console.log("1~invalidateUserSessions", tokenItem.userId);
      await invalidateUserSessions(tokenItem.userId);
      console.log("2~setSession", tokenItem.userId);
      await setSession(tokenItem.userId);
      redirect("/settings");
    } else {
      console.log("3~hasUser");
    }
  });

export type VerifyEmailByCodeReturnType = inferServerActionReturnTypeHot<
  typeof verifyEmailByCodeAction
>;
export const verifyEmailByTokenAction = createServerAction()
  .input(OnlyTokenSchema)
  .handler(async ({ input }) => {
    const { token } = input;
    let tokenItem = await getTokenByToken(token, "VERIFY_EMAIL");
    if (!tokenItem) {
      throw new ZSAError(
        "FORBIDDEN",
        process.env.NODE_ENV === "development"
          ? "[dev]Code is not found"
          : "Code is invalid or expired",
      );
    }
    tokenItem = await verifyDBTokenByCode(
      tokenItem.userId,
      { token },
      tokenItem.type,
      true,
    );

    const { user } = await validateRequest();
    const db = await getDB();
    await updateUserEmailVerified(db, tokenItem.userId, tokenItem.email);
    if (!user) {
      // if user is not logged in, set session
      await invalidateUserSessions(tokenItem.userId);
      await setSession(tokenItem.userId);
    }
    redirect("/settings");
  });

export const updateUserAvatarAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateAvatarSchema)
  .handler(async ({ input, ctx }) => {
    const { image } = input;
    const { user } = ctx;
    const db = await getDB();
    const { url } = await storage.upload(`avatars/${generateId()}`, image);
    await updateUserAvatar(db, user.id, url);
    waitUntil(
      (async () => {
        if (user.avatarUrl && isStored(user.avatarUrl)) {
          await storage.delete(user.avatarUrl);
        }
      })(),
    );
    revalidatePath("/");
  });

export const deleteUserAction = authenticatedProcedure
  .createServerAction()
  .input(DeleteUserSchema)
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDB();
    await deleteUser(db, user.id);
    await invalidateUserSessions(user.id);
    setBlankSessionCookie();
    return redirect("/");
  });

export const getUserOAuthAccountsAction = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDB();
    const oauthAccounts = await getUserOAuthAccounts(db, user.id);
    return {
      oauthAccounts,
    };
  });

export const removeUserOAuthAccountAction = authenticatedProcedure
  .createServerAction()
  .input(DeleteOAuthAccountSchema)
  .handler(async ({ input, ctx }) => {
    const { provider } = input;
    const { user } = ctx;
    const db = await getDB();
    await removeUserOAuthAccount(db, user.id, provider as ProviderType);
  });

export const changeUsernameAction = authenticatedProcedure
  .createServerAction()
  .input(ChangeUsernameSchema)
  .handler(async ({ input, ctx }) => {
    const { username } = input;
    const { user } = ctx;
    const db = await getDB();
    await updateUsername(db, user.id, username);
  });
