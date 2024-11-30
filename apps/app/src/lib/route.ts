import setEnv from '@/server/middleware/env';
import { onError } from '@/server/middleware/on-error';
import { assertAuthMiddleware } from '@/server/middleware/user';
import analytics from '@/server/route/analytics';
import email from '@/server/route/email';
import invite from '@/server/route/invite';
import login from '@/server/route/login';
import logout from '@/server/route/logout';
import oauth from '@/server/route/oauth';
import org from '@/server/route/org';
import project from '@/server/route/project';
import resetPassword from '@/server/route/reset-password';
import signup from '@/server/route/signup';
import test from '@/server/route/test';
import url from '@/server/route/url';
import user from '@/server/route/user';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from '../server/route/route-types';

export const app = new Hono<Context>()
  .basePath('/api')
  .use(cors())
  .use(setEnv)
  // Authenticated routes
  .use('/project/*', assertAuthMiddleware)
  .use('/org/*', assertAuthMiddleware)
  .use('/url/*', assertAuthMiddleware)
  .use('/user/*', assertAuthMiddleware)
  .use('/analytics/*', assertAuthMiddleware)
  .route('/', user)
  .route('/', url)
  .route('/', analytics)
  .route('/', project)
  .route('/', org)
  // Not authenticated
  .route('/', test)
  .route('/', login)
  .route('/', logout)
  .route('/', resetPassword)
  .route('/', signup)
  .route('/', oauth)
  .route('/', invite)
  .route('/', email)
  .onError(onError);

export type AppType = typeof app;
