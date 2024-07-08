import { createServerActionProcedure, ZSAError } from "zsa";
import { OnlyEmailSchema } from "../zod/schemas/auth";
import { assertAuthenticated } from "@/lib/session";
import { getUserByEmail } from "../db/data-access/user";

export const getUserByEmailProcedure = createServerActionProcedure()
  .input(OnlyEmailSchema)
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await getUserByEmail(email);
    if (!user) {
      throw new ZSAError(
        "NOT_FOUND",
        process.env.NODE_ENV === "development"
          ? "[dev] User not found by email: " + email
          : "Email not found",
      );
    }
    return {
      user,
    };
  });

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    return await assertAuthenticated();
  },
);
