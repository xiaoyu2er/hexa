import { IS_DEVELOPMENT, PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import {} from '@/lib/session';
import { SignupSchema } from '@/lib/zod/schemas/auth';
import {} from '@/server/data-access/account';
import { addTmpUser } from '@/server/data-access/tmp-user';
import { getEmail, getUserByName } from '@/server/data-access/user';
import { turnstile } from '@/server/middleware/turnstile';
import { updatePasscodeAndSendEmail } from '@/server/serverice/passcode';
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
