import { z } from 'zod';

const cfTurnstileResponse = z.string({
  message: 'Please complete the challenge.',
});

export const TurnstileSchema = z.object({
  'cf-turnstile-response': cfTurnstileResponse,
});

export type TurnstileType = z.infer<typeof TurnstileSchema>;
