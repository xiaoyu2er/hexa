"use server";

import { ZSAError } from "zsa";
import {
  addWorkspaceMember,
  createWorkspace,
  queryWorkspaceBySlug,
} from "../db/data-access/workspace";
import { CreateWorkspaceSchema } from "../zod/schemas/workspace";
import { authenticatedProcedure } from "./procedures";
import { revalidatePath } from "next/cache";

export const createWorkspaceAction = authenticatedProcedure
  .createServerAction()
  .input(CreateWorkspaceSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const { name, slug } = input;
    const ws = await queryWorkspaceBySlug(slug);
    if (ws) {
      throw new ZSAError("CONFLICT", "Workspace with this slug already exists");
    }
    const workspace = await createWorkspace({ name, slug });
    if (!workspace) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create workspace");
    }
    const member = await addWorkspaceMember({
      userId: user.id,
      workspaceId: workspace.id,
      role: "OWNER",
    });
    if (!member) {
      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to add workspace member",
      );
    }

    revalidatePath("/workspaces");

    return {
      //   workspace,
      //   member,
    };
  });
