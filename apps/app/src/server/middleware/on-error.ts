import { inspect } from 'node:util';
import { ERROR_CODE_TO_HTTP_STATUS } from '@/lib/error/error';
import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import type { Context } from '../route/route-types';

export const onError: ErrorHandler<Context> = (error, c) => {
  if (error instanceof ZodError) {
    return c.json({ error: error, success: false }, 400);
  }
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

  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error(error);
  return c.json(
    {
      error: {
        cause: inspect(error, { depth: null }),
        message: error.message,
      },
    },
    500
  );
};
