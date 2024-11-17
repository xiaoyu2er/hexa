import { oauthAccountTable } from '@/features/oauth-account/table';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ProviderTypeSchema = z.enum(['GOOGLE', 'GITHUB']);
export type ProviderType = z.infer<typeof ProviderTypeSchema>;

// Oauth Account
export const InsertOauthAccountSchema = createInsertSchema(oauthAccountTable, {
  provider: ProviderTypeSchema,
});
export type InsertOauthAccountType = z.infer<typeof InsertOauthAccountSchema>;
export const SelectOauthAccountSchema = createSelectSchema(oauthAccountTable, {
  provider: ProviderTypeSchema,
});
export type SelectOauthAccountType = z.infer<typeof SelectOauthAccountSchema>;
