import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import { EmailSchema, PasswordSchema } from '@/features/common/schema';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const LoginPasswordSchema = z
  .object({})
  .merge(EmailSchema)
  .merge(PasswordSchema)
  .merge(TurnstileSchema);

export type LoginPasswordType = Simplify<z.infer<typeof LoginPasswordSchema>>;
