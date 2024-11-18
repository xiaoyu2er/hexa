import { TurnstileSchema } from '@/features/auth/turnstile/schema';
import { PasswordSchema } from '@/features/common/schema';
import type { Simplify } from 'drizzle-orm';
import { z } from 'zod';

export const LoginPasswordSchema = z
  .object({
    name: z.string().min(3, 'Please enter a valid username or email'),
  })
  .merge(PasswordSchema)
  .merge(TurnstileSchema);

export type LoginPasswordInput = Simplify<z.infer<typeof LoginPasswordSchema>>;
