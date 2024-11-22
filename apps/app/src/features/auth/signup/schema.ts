import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import {
  EmailSchema,
  NameSchema,
  PasswordSchema,
  zOrgNameString,
} from '@/features/common/schema';
import { z } from 'zod';

export const OrgNameSchema = z.object({
  orgName: zOrgNameString.nullable(),
});
export type OrgNameType = z.infer<typeof OrgNameSchema>;

export const SignupSchema = z
  .object({
    // password: zPasswordString.optional(),
  })
  .merge(EmailSchema)
  .merge(PasswordSchema)
  .merge(NameSchema)
  .merge(OrgNameSchema)
  .merge(TurnstileSchema);

export type SignupType = z.infer<typeof SignupSchema>;
