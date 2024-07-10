"use server";

import { authenticatedProcedure } from "./procedures";
import {
  DeleteUserSchema,
  UpdateAvatarSchema,
  UpdateUserNameSchema,
} from "@/lib/zod/schemas/user";
import {
  createUserEmail,
  deleteUser,
  getUserEmail,
  getUserEmails,
  removeUserEmail,
  updateUserAvatar,
  updateUserEmailVerified,
  updateUserName,
  updateUserPrimaryEmail,
} from "@/lib/db/data-access/user";
import { revalidatePath } from "next/cache";
import { isStored, storage } from "../storage";
import { generateId } from "../utils";
import { waitUntil } from "@vercel/functions";
import { invalidateUserSessions, setBlankSessionCookie } from "../session";
import { redirect } from "next/navigation";
import { OTPSchema, OnlyEmailSchema } from "../zod/schemas/auth";
import { updateTokenAndSendVerifyEmail } from "./sign-up";
import { ZSAError, createServerAction } from "zsa";
import { verifyDBTokenByCode } from "../db/data-access/token";

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
    await updateUserName(user.id, name);
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

export const verifyEmailByCodeAction = authenticatedProcedure
  .createServerAction()
  .input(OTPSchema)
  .handler(async ({ input }) => {
    const { code, email } = input;
    const user = await getUserEmail(email);

    if (!user) {
      throw new ZSAError(
        "NOT_FOUND",
        process.env.NODE_ENV === "development"
          ? `User with email ${email} not found`
          : "User not found"
      );
    }

    const tokenItem = await verifyDBTokenByCode(
      user.id,
      { code },
      "VERIFY_EMAIL",
      true
    );

    await updateUserEmailVerified(tokenItem.userId, email);
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
      })()
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
