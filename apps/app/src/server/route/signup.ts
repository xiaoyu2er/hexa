import { PUBLIC_URL } from '@/lib/env';
import { ApiError } from '@/lib/error/error';
import {} from '@/lib/session';
import { creatUserFromTmpUserMiddleware } from '@/server/middleware/oauth';
import {
  getPasscodeByTokenMiddleware,
  getPasscodeMiddleware,
  resendPasscodeMiddleware,
} from '@/server/middleware/passcode';
import { turnstileMiddleware } from '@/server/middleware/turnstile';
import type { Context } from '@/server/route/route-types';
import { OauthSignupSchema } from '@/server/schema/oauth';
import {
  ResendPasscodeSchema,
  VerifyPassTokenSchema,
  VerifyPasscodeSchema,
} from '@/server/schema/passcode';
import { SignupSchema, type SignupType } from '@/server/schema/signup';
import { addPasscodeAndSendEmail } from '@/server/service/passcode';
import { addTmpUser } from '@/server/store/tmp-user';
import { getEmail } from '@/server/store/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

const signup = new Hono<Context>()
  // ====== Signup ======
  // Signup send passcode
  .post(
    '/signup/send-passcode',
    zValidator('json', SignupSchema.or(OauthSignupSchema)),
    turnstileMiddleware(),
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
    turnstileMiddleware(),
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
