import { inspect } from 'node:util';
import login from '@/features/auth/login/route';
import logout from '@/features/auth/logout/route';
import oauth from '@/features/auth/oauth/route';
import resetPassword from '@/features/auth/reset-password/route';
import signup from '@/features/auth/signup/route';
import setEnv from '@/features/env/middleware';
import test from '@/features/env/route';
import org from '@/features/org/route';
import passcode from '@/features/passcode/route';
import user from '@/features/user/route';
import owner from '@/features/workspace-owner/route';
import workspace from '@/features/workspace/route';
import { IS_DEVELOPMENT } from '@/lib/env';
import { ERROR_CODE_TO_HTTP_STATUS } from '@/lib/error/error';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from './types';

export const app = new Hono<Context>()
  .basePath('/api')
  .use(cors())
  .use(setEnv)
  .route('/', test)
  .route('/', login)
  .route('/', logout)
  .route('/', resetPassword)
  .route('/', signup)
  .route('/', user)
  .route('/', passcode)
  .route('/', oauth)
  .route('/', workspace)
  .route('/', org)
  .route('/', owner)
  .onError((error, c) => {
    // @ts-ignore
    const code = error.code;
    if (code) {
      // @ts-ignore
      const status = ERROR_CODE_TO_HTTP_STATUS[code] ?? 500;
      return c.json(
        {
          error: {
            message: error.message,
          },
        },
        status
      );
    }

    if (IS_DEVELOPMENT) {
      return c.json(
        {
          error: {
            cause: inspect(error, { depth: null }),
            message: error.message,
          },
        },
        500
      );
    }

    return c.json(
      {
        error: {
          message: error.message,
        },
      },
      500
    );
  });

export type AppType = typeof app;