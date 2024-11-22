import { creatUserFromTmpUserMiddleware } from '@/features/auth/oauth/middleware';
import { OauthSignupSchema } from '@/features/auth/oauth/schema';
import { SignupSchema, type SignupType } from '@/features/auth/signup/schema';
import { turnstile } from '@/features/auth/turnstile/middleware';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@/features/passcode/middleware';
import {
  ResendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from '@/features/passcode/schema';
import { addPasscodeAndSendEmail } from '@/features/passcode/service';
import { addTmpUser } from '@/features/tmp-user/store';
import { getEmail } from '@/features/user/store';
import { PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import type { Context } from '@/lib/route-types';
import {} from '@/lib/session';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const signup = new Hono<Context>()
  // ====== Signup ======
  // Signup send passcode
  .post(
    '/signup/send-passcode',
    zValidator('json', SignupSchema.or(OauthSignupSchema)),
    turnstile(),
    async (c) => {
      const db = c.get('db');
      const { email, password, name, orgName } = c.req.valid(
        'json'
      ) as SignupType;
      const emailItem = await getEmail(db, email);

      if (emailItem?.verified) {
        throw new ApiError(
          'CONFLICT',
          'This email is taken by another account'
        );
      }

      // Create pending registration
      const tmpUser = await addTmpUser(db, {
        email,
        password,
        name,
        orgName,
      });

      if (!tmpUser) {
        throw new ApiError('BAD_REQUEST', 'Failed to create tmp user');
      }
      // Send email with passcode
      const data = await addPasscodeAndSendEmail(db, {
        tmpUserId: tmpUser.id,
        email,
        type: 'SIGN_UP',
        verifyUrlPrefex: `${PUBLIC_URL}/api/signup/verify-token/`,
      });

      return c.json(data);
    }
  )
  // Signup resend passcode
  .post(
    '/signup/resend-passcode',
    zValidator('json', ResendPasscodeSchema),
    turnstile(),
    resendPasscodeMiddleware(`${PUBLIC_URL}/api/signup/verify-token/`)
  )
  // Signup verify passcode
  .post(
    '/signup/verify-passcode',
    zValidator('json', VerifyPasscodeSchema),
    getPasscodeMiddleware('json', 'SIGN_UP'),
    creatUserFromTmpUserMiddleware
  )
  // Signup verify token
  .get(
    '/signup/verify-token/:token',
    zValidator('param', VerifyPassTokenSchema),
    getPasscodeByTokenMiddleware('param', 'SIGN_UP'),
    creatUserFromTmpUserMiddleware
  );

export default signup;
