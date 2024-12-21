import {
  NameSchema,
  UpdateAvatarSchema,
  zName,
  zSlug,
} from '@hexa/server/schema/common';
import { SelectOrgSchema, zOrgId } from '@hexa/server/schema/org';
import { zOrgMemberRole } from '@hexa/server/schema/org-member';
import { projectTable } from '@hexa/server/table/project';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const zProjectId = z.string().min(1);

export const ProjectIdSchema = z.object({
  projectId: zProjectId,
});

export type ProjectIdType = z.infer<typeof ProjectIdSchema>;

// Insert Project
export const InsertProjectSchema = createInsertSchema(projectTable, {
  orgId: zOrgId,
  slug: zSlug,
  name: zName,
});

export type InsertProjectType = Simplify<z.infer<typeof InsertProjectSchema>>;

// Select Project
export const SelectProjectSchema = createSelectSchema(projectTable).extend({
  role: zOrgMemberRole,
  org: SelectOrgSchema,
});
export type SelectProjectType = z.infer<typeof SelectProjectSchema> & {
  domains: string[];
};

// Update Project Name
export const UpdateProjectrNameSchema = z
  .object({})
  .merge(ProjectIdSchema)
  .merge(NameSchema);
export type UpdateProjectNameType = z.infer<typeof UpdateProjectrNameSchema>;

// Delete Project
export const DELETE_PROJECT_CONFIRMATION = 'Confirm delete project';
export const DeleteProjectSchema = z
  .object({
    confirm: z
      .string()
      .refine(
        (v) => v === DELETE_PROJECT_CONFIRMATION,
        `Please type '${DELETE_PROJECT_CONFIRMATION}' to delete your project.`
      ),
  })
  .merge(ProjectIdSchema);
export type DeleteProjectType = z.infer<typeof DeleteProjectSchema>;

// Update Project Slug
export const UpdateProjectSlugSchema = z
  .object({
    slug: zSlug,
  })
  .merge(ProjectIdSchema);

export type UpdateProjectSlugType = z.infer<typeof UpdateProjectSlugSchema>;

// Update Project Avatar
export const UpdateProjectAvatarSchema =
  UpdateAvatarSchema.merge(ProjectIdSchema);
export type UpdateProjectAvatarType = z.infer<typeof UpdateProjectAvatarSchema>;
