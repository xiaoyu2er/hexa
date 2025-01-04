// https://developers.cloudflare.com/d1/observability/debug-d1/#errors

export const isD1Error = (error: unknown) => {
  return error instanceof Error && error.message.startsWith('D1_');
};

export const isUniqueConstraintViolationError = (error: unknown) => {
  return (
    error instanceof Error &&
    error.message.startsWith('D1_') &&
    error.message.includes('UNIQUE constraint failed')
  );
};
