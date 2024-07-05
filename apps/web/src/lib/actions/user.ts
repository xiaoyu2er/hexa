"use server";

import { authenticatedProcedure } from "./procedures";
import {
  DeleteAccountSchema,
  UpdateAvatarSchema,
  UpdateUserNameSchema,
} from "@/lib/zod/schemas/user";
import {
  deleteUser,
  updateUserAvatar,
  updateUserName,
} from "@/lib/db/data-access/user";
import { revalidatePath } from "next/cache";
import { isStored, storage } from "../storage";
import { generateId } from "../utils";
import { waitUntil } from "@vercel/functions";
import { invalidateUserSessions, setBlankSessionCookie } from "../session";
import { redirect } from "next/navigation";

export const updateUserNameAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateUserNameSchema)
  .handler(async ({ input, ctx }) => {
    const { name } = input;
    const { user } = ctx;
    await updateUserName(user.id, name);
    revalidatePath("/");
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

export const deleteAccountAction = authenticatedProcedure
  .createServerAction()
  .input(DeleteAccountSchema)
  .handler(async ({ ctx }) => {
    const { user } = ctx;
    await deleteUser(user.id);
    await invalidateUserSessions(user.id);
    setBlankSessionCookie();
    return redirect("/");
  });
