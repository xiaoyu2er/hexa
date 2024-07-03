"use server";

import { authenticatedProcedure } from "./procedures";
import { UpdateUserNameSchema } from "../zod/schemas/user";
import { updateUserName } from "../db/data-access/user";
import { revalidatePath } from "next/cache";

export const updateUserNameAction = authenticatedProcedure
  .createServerAction()
  .input(UpdateUserNameSchema)
  .handler(async ({ input, ctx }) => {
    const { name } = input;
    const { user } = ctx;
    await updateUserName(user.id, name);
    revalidatePath("/");
  });
