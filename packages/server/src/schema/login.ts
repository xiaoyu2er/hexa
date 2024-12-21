import { EmailSchema, PasswordSchema } from '@hexa/server/schema/common';
import { TurnstileSchema } from '@hexa/server/schema/turnstile';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

export const LoginPasswordSchema = z
  .object({})
  .merge(EmailSchema)
  .merge(PasswordSchema)
  .merge(TurnstileSchema);

export type LoginPasswordType = Simplify<z.infer<typeof LoginPasswordSchema>>;
