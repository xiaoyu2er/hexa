import { IS_DEVELOPMENT } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import { setSession } from '@/lib/session';
import { isHashValid } from '@/lib/utils';
import { getUserByName, getUserEmail } from '@/server/data-access/user';
import { LoginPasswordSchema } from '@/server/db/schema';
import { turnstile } from '@/server/middleware/turnstile';
import type { Context } from '@/server/types';
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
