import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { orgTable } from '@/features/org/table';

import type { OrgRole } from '@/features/org-member/schema';
import type { z } from 'zod';

// Org
export const InsertOrgSchema = createInsertSchema(orgTable);
export type InsertOrgType = z.infer<typeof InsertOrgSchema>;
export const SelectOrgSchema = createSelectSchema(orgTable);
export type SelectOrgType = z.infer<typeof SelectOrgSchema>;
export type SelectUserOrgType = SelectOrgType & {
  role: OrgRole;
};
