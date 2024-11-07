import { assertAuthenticated } from "@/lib/session";
import { OnlyEmailSchema } from "@/lib/zod/schemas/auth";
import { getDB } from "@/server/db";
import { getUserEmail } from "@/server/db/data-access/user";
import { ZSAError, createServerActionProcedure } from "zsa";

export const getUserEmailProcedure = createServerActionProcedure()
  .input(OnlyEmailSchema)
  .handler(async ({ input }) => {
    const { email } = input;
    const db = await getDB();
    const emailItem = await getUserEmail(db, email);

    if (!emailItem || !emailItem.user) {
      throw new ZSAError(
        "NOT_FOUND",
        process.env.NODE_ENV === "development"
          ? `[dev] User not found by email: ${email}`
          : "Email not found",
      );
    }
    return {
      email: emailItem,
    };
  });

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    return await assertAuthenticated();
  },
);
