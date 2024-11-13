import { inspect } from 'node:util';
import { IS_DEVELOPMENT } from '@/lib/env';
import { ERROR_CODE_TO_HTTP_STATUS } from '@/lib/error/error';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import setEnv from './middleware/set-env';
import login from './route/login';
import logout from './route/logout';
import oauth from './route/oauth';
import passcode from './route/passcode';
import resetPassword from './route/reset-password';
import signup from './route/signup';
import test from './route/test';
import user from './route/user';
import workspace from './route/workspace';
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
