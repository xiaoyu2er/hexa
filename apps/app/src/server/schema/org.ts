import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { orgTable } from '@/server/table/org';

import { NameSchema, UpdateAvatarSchema } from '@/server/schema/common';
import type { OrgMemberRoleType } from '@/server/schema/org-memeber';
import { z } from 'zod';

// Org
export const InsertOrgSchema = createInsertSchema(orgTable);
export type InsertOrgType = z.infer<typeof InsertOrgSchema>;
export const SelectOrgSchema = createSelectSchema(orgTable);
export type SelectOrgType = z.infer<typeof SelectOrgSchema>;
export type SelectUserOrgType = SelectOrgType & {
  role: OrgMemberRoleType;
};

export const zOrgIdString = z
  .string({ message: 'Please select an organization' })
  .min(1, 'Please select an organization');

export const OrgIdSchema = z.object({
  orgId: zOrgIdString,
});

// Update Org Name
export const UpdateOrgNameSchema = z
  .object({})
  .merge(OrgIdSchema)
  .merge(NameSchema);

export type UpdateOrgNameType = z.infer<typeof UpdateOrgNameSchema>;

// Delete Org
export const DELETE_ORG_CONFIRMATION = 'Confirm delete organization';
export const DeleteOrgSchema = z
  .object({
    confirm: z
      .string({ message: 'Please type the confirmation text' })
      .refine(
        (v) => v === DELETE_ORG_CONFIRMATION,
        'Please type the confirmation text'
      ),
  })
  .merge(OrgIdSchema);
export type DeleteOrgType = z.infer<typeof DeleteOrgSchema>;

// Update Org Avatar
export const UpdateOrgAvatarSchema = UpdateAvatarSchema.merge(OrgIdSchema);
export type UpdateOrgAvatarType = z.infer<typeof UpdateOrgAvatarSchema>;
