import { createServerActionProcedure, ZSAError } from "zsa";
import { db } from "@/lib/db";
import { OnlyEmailSchema } from "../zod/schemas/auth";
import { assertAuthenticated } from "@/lib/session";

export const getUserByEmailProcedure = createServerActionProcedure()
  .input(OnlyEmailSchema)
  .handler(async ({ input }) => {
    const { email } = input;
    const user = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
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
    return {
      user: await assertAuthenticated(),
    };
  },
);
