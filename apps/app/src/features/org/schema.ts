import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { orgTable } from '@/features/org/table';

import type { OrgMemberRole } from '@/features/org-member/schema';
import { z } from 'zod';

// Org
export const InsertOrgSchema = createInsertSchema(orgTable);
export type InsertOrgType = z.infer<typeof InsertOrgSchema>;
export const SelectOrgSchema = createSelectSchema(orgTable);
export type SelectOrgType = z.infer<typeof SelectOrgSchema>;
export type SelectUserOrgType = SelectOrgType & {
  role: OrgMemberRole;
};

export const zOrgIdString = z
  .string({ message: 'Please select an organization' })
  .min(1, 'Please select an organization');
