import { IS_DEVELOPMENT } from '@hexa/env';
// @ts-ignore
import { TimeSpan } from 'oslo';

export const MIN_PASSWORD_LENGTH = IS_DEVELOPMENT ? 3 : 8;

export const RESEND_VERIFY_CODE_TIME_SPAN = IS_DEVELOPMENT
  ? new TimeSpan(3, 's')
  : new TimeSpan(60, 's');

export const VERIFY_CODE_LENGTH = 6;
export const EXIPRE_TIME_SPAN = IS_DEVELOPMENT
  ? new TimeSpan(30, 's') // 30 seconds
  : new TimeSpan(10, 'm'); // 10 minutes

export const RESET_PASSWORD_EXPIRE_TIME_SPAN = IS_DEVELOPMENT
  ? new TimeSpan(60, 's')
  : new TimeSpan(15, 'm');

export const INVITE_EXPIRE_TIME_SPAN = IS_DEVELOPMENT
  ? new TimeSpan(3, 'h')
  : new TimeSpan(7, 'd');

export const MAX_EMAILS = IS_DEVELOPMENT ? 3 : 5;
