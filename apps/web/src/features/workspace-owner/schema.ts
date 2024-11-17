import { workspaceOwnerTable } from '@/features/workspace-owner/table';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OwnerTypeSchema = z.enum(['USER', 'ORG']);
export type OwnerType = z.infer<typeof OwnerTypeSchema>;

// Workspace Owner
export const InsertWorkspaceOwnerSchema = createInsertSchema(
  workspaceOwnerTable,
  {
    ownerType: OwnerTypeSchema,
  }
);

export type InsertWorkspaceOwnerType = z.infer<
  typeof InsertWorkspaceOwnerSchema
>;

export const SelectWorkspaceOwnerSchema = createSelectSchema(
  workspaceOwnerTable,
  {
    ownerType: OwnerTypeSchema,
  }
);
export type SelectWorkspaceOwnerType = z.infer<
  typeof SelectWorkspaceOwnerSchema
>;
