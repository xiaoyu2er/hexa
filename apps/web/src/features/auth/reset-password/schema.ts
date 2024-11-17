import { PasswordSchema } from '@/features/common/schema';
import { TokenSchema } from '@/features/passcode/schema';
import { z } from 'zod';

export const ResetPasswordSchema = z
  .object({})
  .merge(TokenSchema)
  .merge(PasswordSchema);

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
