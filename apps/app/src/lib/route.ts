import setEnv from '@/server/middleware/env';
import { onError } from '@/server/middleware/on-error';
import { protectApi } from '@/server/middleware/protect-api';
import { assertAuthMiddleware } from '@/server/middleware/user';
import analytics from '@/server/route/analytics';
import domain from '@/server/route/domain';
import email from '@/server/route/email';
import invite from '@/server/route/invite';
import link from '@/server/route/link';
import login from '@/server/route/login';
import logout from '@/server/route/logout';
import oauth from '@/server/route/oauth';
import org from '@/server/route/org';
import project from '@/server/route/project';
import resetPassword from '@/server/route/reset-password';
import signup from '@/server/route/signup';
import test from '@/server/route/test';
import user from '@/server/route/user';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from '../server/route/route-types';

export const app = new Hono<Context>()
  .basePath('/api')
  .use(protectApi)
  .use(cors())
  .use(setEnv)
  // Authenticated routes
  .use('/project/*', assertAuthMiddleware)
  .use('/org/*', assertAuthMiddleware)
  .use('/link/*', assertAuthMiddleware)
  .use('/user/*', assertAuthMiddleware)
  .use('/analytics/*', assertAuthMiddleware)
  .route('/', user)
  .route('/', link)
  .route('/', analytics)
  .route('/', project)
  .route('/', org)
  .route('/', domain)
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
