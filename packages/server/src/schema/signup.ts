import {
  EmailSchema,
  PasswordSchema,
  zOrgName,
} from '@hexa/server/schema/common';
import { TurnstileSchema } from '@hexa/server/schema/turnstile';
import { z } from 'zod';

export const OrgNameSchema = z.object({
  orgName: zOrgName.nullable(),
});
export type OrgNameType = z.infer<typeof OrgNameSchema>;

export const SignupSchema = z
  .object({
    // password: zPassword.optional(),
  })
  .merge(EmailSchema)
  .merge(PasswordSchema)
  .merge(TurnstileSchema);

export type SignupType = z.infer<typeof SignupSchema>;
