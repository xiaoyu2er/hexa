import { z } from "zod";


export const SetUserDefaultWorkspaceSchema = z.object({
  workspaceId: z.string().min(1, "Please select a workspace"),
});

const name = z
  .string()
  .min(1, "Please enter a name")
  .max(32, "Name must be less than 32 characters");

export const UpdateWorkspacerNameSchema = z.object({
  name,
  workspaceId: z.string().min(1, "Please enter a workspace ID"),
});

export type UpdateWorkspaceNameInput = z.infer<typeof UpdateWorkspacerNameSchema>;


export type SetUserDefaultWorkspaceInput = z.infer<
  typeof SetUserDefaultWorkspaceSchema
>;

export const CreateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter a name")
    .max(32, "Name must be less than 32 characters"),
  // only allow alphanumeric characters, dashes, and max length of 32
  slug: z
    .string()
    .min(1, "Please enter a slug")
    .max(32, "Slug must be less than 32 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Slug must be alphanumeric and dashes only"),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;

export const DELETE_WORKSPACE_CONFIRMATION = "confirm delete workspace";
export const DeleteWorkspaceSchema = z.object({
  confirm: z
    .string()
    .refine(
      (v) => v === DELETE_WORKSPACE_CONFIRMATION,
      `Please type '${DELETE_WORKSPACE_CONFIRMATION}' to delete your account.`
    ),
  workspaceId: z.string().min(1, "Please enter a workspace ID"),
});

export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceSchema>;
