import { ApiError } from '@/lib/error/error';
import type { Context } from '@/lib/route-types';
import { turnstileMiddleware } from '@/server/middleware/turnstile';
import { CheckEmailSchema } from '@/server/schema/user';
import { getEmail } from '@/server/store/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const email = new Hono<Context>()
  // Check if email is already taken
  .post(
    '/email',
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
