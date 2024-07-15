import { assertAuthenticated } from "@/lib/session";
import { ZSAError, createServerActionProcedure } from "zsa";
import { getUserEmail } from "../db/data-access/user";
import { OnlyEmailSchema } from "../zod/schemas/auth";

export const getUserEmailProcedure = createServerActionProcedure()
  .input(OnlyEmailSchema)
  .handler(async ({ input }) => {
    const { email } = input;
    const emailItem = await getUserEmail(email);

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
