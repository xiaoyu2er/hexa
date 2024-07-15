"use server";

import { authenticatedProcedure, getUserEmailProcedure } from "./procedures";
import {
  ChangeUsernameSchema,
  DeleteOAuthAccountSchema,
  DeleteUserSchema,
  UpdateAvatarSchema,
  UpdateUserNameSchema,
} from "@/lib/zod/schemas/user";
import {
  createUserEmail,
  deleteUser,
  getUserEmails,
  removeUserEmail,
  updateUserAvatar,
  updateUserEmailVerified,
  updateProfileName,
  updateUserPrimaryEmail,
  updateUsername,
} from "@/lib/db/data-access/user";
import { revalidatePath } from "next/cache";
import { isStored, storage } from "../storage";
import { generateId } from "../utils";
import { waitUntil } from "@vercel/functions";
import {
  invalidateUserSessions,
  setBlankSessionCookie,
  setSession,
} from "../session";
import { redirect } from "next/navigation";
import {
  OTPSchema,
  OnlyEmailSchema,
  OnlyTokenSchema,
} from "../zod/schemas/auth";
import { updateTokenAndSendVerifyEmail } from "./sign-up";
import {
  ZSAError,
  createServerAction,
  inferServerActionReturnTypeHot,
} from "zsa";
import { getTokenByToken, verifyDBTokenByCode } from "../db/data-access/token";
import {
  getUserOAuthAccounts,
  removeUserOAuthAccount,
} from "../db/data-access/account";
import { ProviderType } from "../db";
import { validateRequest } from "../auth";

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
    await updateProfileName(user.id, name);
    revalidatePath("/");
  });

export const getUserEmailsAction = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    const emails = await getUserEmails(user.id);
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

    await createUserEmail({
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
    await updateUserPrimaryEmail(user.id, email);
  });

export const removeUserEmailAction = authenticatedProcedure
  .createServerAction()
  .input(OnlyEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { email } = input;
    const { user } = ctx;
    await removeUserEmail(user.id, email);
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
    await updateUserEmailVerified(tokenItem.userId, tokenItem.email);
    if (!user) {
      await invalidateUserSessions(tokenItem.userId);
      await setSession(tokenItem.userId);
      redirect("/settings");
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
    await updateUserEmailVerified(tokenItem.userId, tokenItem.email);
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
    const { url } = await storage.upload(`avatars/${generateId()}`, image);
    await updateUserAvatar(user.id, url);
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
    await deleteUser(user.id);
    await invalidateUserSessions(user.id);
    setBlankSessionCookie();
    return redirect("/");
  });

export const getUserOAuthAccountsAction = authenticatedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    const oauthAccounts = await getUserOAuthAccounts(user.id);
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
    await removeUserOAuthAccount(user.id, provider as ProviderType);
  });

export const changeUsernameAction = authenticatedProcedure
  .createServerAction()
  .input(ChangeUsernameSchema)
  .handler(async ({ input, ctx }) => {
    const { username } = input;
    const { user } = ctx;
    await updateUsername(user.id, username);
  });
