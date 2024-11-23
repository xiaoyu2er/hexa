import { inspect } from 'node:util';
import { IS_DEVELOPMENT } from '@/lib/env';
import { ERROR_CODE_TO_HTTP_STATUS } from '@/lib/error/error';
import setEnv from '@/server/middleware/env';
import email from '@/server/route/email';
import test from '@/server/route/env';
import login from '@/server/route/login';
import logout from '@/server/route/logout';
import oauth from '@/server/route/oauth';
import org from '@/server/route/org';
import project from '@/server/route/project';
import resetPassword from '@/server/route/reset-password';
import signup from '@/server/route/signup';
import user from '@/server/route/user';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from '../server/route/route-types';

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
  .route('/', oauth)
  .route('/', project)
  .route('/', org)
  .route('/', email)
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
