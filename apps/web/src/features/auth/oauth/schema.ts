import { oauthAccountTable } from '@/features/auth/oauth/table';
import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import { NameSchema } from '@/features/common/schema';

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

export const OauthSignupSchema = z
  .object({
    oauthAccountId: z.string(),
    // password,
  })
  .merge(NameSchema)
  .merge(TurnstileSchema);
export type OauthSignupInput = z.infer<typeof OauthSignupSchema>;

export const DeleteOauthAccountSchema = z.object({
  provider: ProviderTypeSchema,
});

export type DeleteOauthAccountInput = z.infer<typeof DeleteOauthAccountSchema>;
