import { z } from 'zod';
import { UpdateAvatarSchema } from './user';

const workspaceId = z.string().min(1, 'Please select a workspace');
export const SetUserDefaultWorkspaceSchema = z.object({
  workspaceId,
});

export type SetUserDefaultWorkspaceInput = z.infer<
  typeof SetUserDefaultWorkspaceSchema
>;

const name = z
  .string()
  .min(1, 'Please enter a name')
  .max(32, 'Name must be less than 32 characters');

const slug = z
  .string()
  .min(1, 'Please enter a slug')
  .max(32, 'Slug must be less than 32 characters')
  .regex(/^[a-zA-Z0-9-]+$/, 'Slug must be alphanumeric and dashes only');

export const GetWorkspaceBySlugSchema = z.object({
  slug,
});

export const UpdateWorkspacerNameSchema = z.object({
  name,
  // workspaceId: z.string().min(1, "Please enter a workspace ID"),
});

export type UpdateWorkspaceNameInput = z.infer<
  typeof UpdateWorkspacerNameSchema
>;

// update slug
export const UpdateWorkspaceSlugSchema = z.object({
  slug,
});

export type UpdateWorkspaceSlugInput = z.infer<
  typeof UpdateWorkspaceSlugSchema
>;

export const CreateWorkspaceSchema = z.object({
  name,
  // only allow alphanumeric characters, dashes, and max length of 32
  slug,
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;

export const DELETE_WORKSPACE_CONFIRMATION = 'confirm delete workspace';
export const DeleteWorkspaceSchema = z.object({
  confirm: z
    .string()
    .refine(
      (v) => v === DELETE_WORKSPACE_CONFIRMATION,
      `Please type '${DELETE_WORKSPACE_CONFIRMATION}' to delete your workspace.`
    ),
  workspaceId,
});

export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceSchema>;

export const UpdateWorkspaceAvatarSchema = UpdateAvatarSchema;

export type UpdateWorkspaceAvatarInput = z.infer<
  typeof UpdateWorkspaceAvatarSchema
>;
