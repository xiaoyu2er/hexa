import { ApiError } from '@hexa/lib';
import { turnstileMiddleware } from '@hexa/server/middleware/turnstile';
import { CheckEmailSchema } from '@hexa/server/schema/user';
import { getEmail } from '@hexa/server/store/user';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const email = new Hono<Context>()
  // Check if email is already taken
  .post(
    '/check-email',
    zValidator('json', CheckEmailSchema),
    turnstileMiddleware(),
    async (c) => {
      const { db } = c.var;
      const { email } = c.req.valid('json');
      const user = await getEmail(db, email);
      if (user) {
        throw new ApiError(
          'CONFLICT',
          'This email is taken by another account'
        );
      }
      return c.json({});
    }
  );

export default email;
