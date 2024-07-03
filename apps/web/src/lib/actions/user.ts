"use server";

import { authenticatedProcedure } from "./procedures";
import {
  UpdateAvatarSchema,
  UpdateUserNameSchema,
} from "@/lib/zod/schemas/user";
import { updateUserAvatar, updateUserName } from "@/lib/db/data-access/user";
import { revalidatePath } from "next/cache";
import { isStored, storage } from "../storage";
import { generateId } from "../utils";
import { waitUntil } from "@vercel/functions";

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
