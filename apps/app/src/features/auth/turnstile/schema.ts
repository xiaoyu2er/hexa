import { DISABLE_CLOUDFLARE_TURNSTILE } from '@/lib/env';
import { z } from 'zod';

const cfTurnstileResponse = DISABLE_CLOUDFLARE_TURNSTILE
  ? z.nullable(z.string().optional())
  : z.string().min(1, 'Please complete the challenge.');

export const TurnstileSchema = z.object({
  'cf-turnstile-response': cfTurnstileResponse,
});
