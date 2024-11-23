import { ApiError } from '@/lib/error/error';
import type { ValidTarget } from '@/server/route/route-types';
import type { PasscodeType } from '@/server/schema/passcode';
import { resendPasscodeAndSendEmail } from '@/server/service/passcode';
import { findPasscodeByToken, verifyPasscode } from '@/server/store/passcode';
import { createMiddleware } from 'hono/factory';

export const resendPasscodeMiddleware = (verifyUrlPrefex: string) =>
  createMiddleware(async (c) => {
    const db = c.get('db');
    // @ts-ignore
    const { id } = c.req.valid('json');
    if (!id) {
      throw new ApiError('BAD_REQUEST', 'The passcode id is required');
    }
    const data = await resendPasscodeAndSendEmail(db, {
      id,
      verifyUrlPrefex,
    });

    return c.json(data);
  });

export const getPasscodeMiddleware = (
  validTarget: ValidTarget,
  type: PasscodeType
) =>
  createMiddleware(async (c, next) => {
    const db = c.get('db');
    // @ts-ignore
    const { id, code } = c.req.valid(validTarget);
    if (!id || !code) {
      throw new ApiError('BAD_REQUEST', 'Passcode id and code are required');
    }
    const passcode = await verifyPasscode(db, {
      code,
      id,
      type,
    });

    c.set('passcode', passcode);
    c.set('tmpUser', passcode?.tmpUser);
    return next();
  });

export const getPasscodeByTokenMiddleware = (
  validTarget: ValidTarget,
  type: PasscodeType
) =>
  createMiddleware(async (c, next) => {
    const db = c.get('db');
    // @ts-ignore
    const { token } = c.req.valid(validTarget);
    if (!token) {
      throw new ApiError('BAD_REQUEST', 'Token is required');
    }
    const passcode = await findPasscodeByToken(db, {
      token,
      type,
    });

    c.set('passcode', passcode);
    c.set('tmpUser', passcode?.tmpUser);
    return next();
  });
