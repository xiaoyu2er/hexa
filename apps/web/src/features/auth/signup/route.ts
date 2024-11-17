import {} from '@/features/auth/oauth/store';
import { turnstile } from '@/features/auth/turnstile/middleware';
import { updatePasscodeAndSendEmail } from '@/features/passcode/service';
import { addTmpUser } from '@/features/tmp-user/store';
import { getEmail, getUserByName } from '@/features/user/store';
import { IS_DEVELOPMENT, PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import {} from '@/lib/session';
import { SignupSchema } from '@/server/db/schema';
import type { Context } from '@/server/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const signup = new Hono<Context>()
  // signup
  .post('/signup', zValidator('json', SignupSchema), turnstile, async (c) => {
    const db = c.get('db');
    const { email, password, name } = c.req.valid('json');
    const emailItem = await getEmail(db, email);

    if (emailItem?.verified) {
      throw new ApiError(
        'CONFLICT',
        IS_DEVELOPMENT ? '[dev]Email already exists' : 'Email already exists'
      );
    }
    const existingUser = await getUserByName(db, name);
    if (existingUser) {
      throw new ApiError('FORBIDDEN', 'Username already exists');
    }

    // Create pending registration
    const tmpUser = await addTmpUser(db, {
      email,
      password,
      name,
    });
    if (!tmpUser) {
      throw new ApiError('BAD_REQUEST', 'Failed to create tmp user');
    }
    // Send email with passcode
    const data = await updatePasscodeAndSendEmail(db, {
      tmpUserId: tmpUser.id,
      email,
      type: 'SIGN_UP',
      publicUrl: PUBLIC_URL,
    });

    return c.json(data);
  });

export default signup;
