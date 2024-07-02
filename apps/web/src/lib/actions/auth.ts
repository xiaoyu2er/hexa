import { assertAuthenticated } from "@/lib/session";
import { createServerActionProcedure } from "zsa";

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    return await assertAuthenticated();
  },
);
