import { UpdateAvatarSchema, name } from '@/features/common/schema';
import {
  OwnerTypeSchema,
  SelectWorkspaceOwnerSchema,
} from '@/features/workspace-owner/schema';
import { workspaceTable } from '@/features/workspace/table';
import type { Simplify } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Workspace
export const InsertWorkspaceSchema = createInsertSchema(workspaceTable).extend({
  ownerId: z.string(),
  ownerType: OwnerTypeSchema,
});

export type InsertWorkspaceType = Simplify<
  z.infer<typeof InsertWorkspaceSchema>
>;
export const SelectWorkspaceSchema = createSelectSchema(workspaceTable).extend({
  owner: SelectWorkspaceOwnerSchema.omit({
    userId: true,
    orgId: true,
    wsId: true,
  })
    .extend({
      ownerName: z.string(),
      ownerId: z.string(),
    })
    .nullable(),
});
export type SelectWorkspaceType = z.infer<typeof SelectWorkspaceSchema>;

export const UpdateWorkspacerNameSchema = z.object({
  name: name,
});

export type UpdateWorkspaceNameInput = z.infer<
  typeof UpdateWorkspacerNameSchema
>;

const workspaceId = z.string().min(1, 'Please select a workspace');
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
export type UpdateWorkspaceAvatarInput = Simplify<
  z.infer<typeof UpdateWorkspaceAvatarSchema>
>;
