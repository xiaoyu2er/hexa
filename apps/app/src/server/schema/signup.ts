import {
  EmailSchema,
  NameSchema,
  PasswordSchema,
  zOrgNameString,
} from '@/server/schema/common';
import { TurnstileSchema } from '@/server/schema/turnstile';
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
