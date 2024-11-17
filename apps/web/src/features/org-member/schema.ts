import { orgMemberTable } from '@/features/org-member/table';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const OrgRoleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER']);
export type OrgRole = z.infer<typeof OrgRoleSchema>;

// Org Member
export const InsertOrgMemberSchema = createInsertSchema(orgMemberTable);
export type InsertOrgMemberType = z.infer<typeof InsertOrgMemberSchema>;
export const SelectOrgMemberSchema = createSelectSchema(orgMemberTable);
export type SelectOrgMemberType = z.infer<typeof SelectOrgMemberSchema>;
