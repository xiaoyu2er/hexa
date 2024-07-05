import { z } from "zod";

export const SetUserDefaultWorkspaceSchema = z.object({
  workspaceId: z.string().min(1, "Please select a workspace"),
});

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
