import { LoginPasswordSchema } from '@/features/auth/login/schema';
import { turnstile } from '@/features/auth/turnstile/middleware';
import { getUserByName, getUserEmail } from '@/features/user/store';
import { isHashValid } from '@/lib/crypto';
import { IS_DEVELOPMENT } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { setSession } from '@/lib/session';
import type { Context } from '@/lib/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const login = new Hono<Context>()
  // Login by password
  .post(
    '/login-password',
    zValidator('json', LoginPasswordSchema),
    turnstile,
    async (c) => {
      const { name, password } = c.req.valid('json');
      const db = c.get('db');
      let existingUser = await getUserByName(db, name);
      if (!existingUser) {
        const emailItem = await getUserEmail(db, name);
        existingUser = emailItem?.user;

        if (!existingUser) {
          throw new ApiError(
            'FORBIDDEN',
            IS_DEVELOPMENT
              ? '[dev] Incorrect email or password'
              : 'Incorrect email or password'
          );
        }
      }

      if (!existingUser.password) {
        throw new ApiError(
          'FORBIDDEN',
          IS_DEVELOPMENT
            ? '[dev] Password is not set'
            : 'Incorrect email or password'
        );
      }

      const validPassword = await isHashValid(existingUser.password, password);

      if (!validPassword) {
        throw new ApiError(
          'FORBIDDEN',
          IS_DEVELOPMENT
            ? '[dev] Incorrect password'
            : 'Incorrect email or password'
        );
      }

      await setSession(existingUser.id);
      return c.redirect(`/${existingUser.name}/settings/profile`);
    }
  );

export default login;
