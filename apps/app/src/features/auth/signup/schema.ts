import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import {
  EmailSchema,
  NameSchema,
  PasswordSchema,
} from '@/features/common/schema';
import { z } from 'zod';

export const SignupSchema = z
  .object({})
  .merge(PasswordSchema)
  .merge(EmailSchema)
  .merge(NameSchema)
  .merge(TurnstileSchema);

export type SignupType = z.infer<typeof SignupSchema>;
