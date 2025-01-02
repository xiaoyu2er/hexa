import { Hono } from 'hono';
import { cors } from 'hono/cors';
import setEnv from './middleware/env';
import { onError } from './middleware/on-error';
import { assertAuthMiddleware } from './middleware/user';
import analytics from './route/analytics';
import domain from './route/domain';
import email from './route/email';
import invite from './route/invite';
import link from './route/link';
import login from './route/login';
import logout from './route/logout';
import oauth from './route/oauth';
import org from './route/org';
import project from './route/project';
import resetPassword from './route/reset-password';
import signup from './route/signup';
import test from './route/test';
import user from './route/user';
import type { Context } from './types';

export const app = new Hono<Context>()
  .basePath('/api')
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
