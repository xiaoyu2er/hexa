/** An enum of error codes */
const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  OUTPUT_PARSE_ERROR: 'OUTPUT_PARSE_ERROR',
  ERROR: 'ERROR',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  TIMEOUT: 'TIMEOUT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  METHOD_NOT_SUPPORTED: 'METHOD_NOT_SUPPORTED',
  UNPROCESSABLE_CONTENT: 'UNPROCESSABLE_CONTENT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export const ERROR_CODE_TO_HTTP_STATUS = {
  BAD_REQUEST: 400,
  OUTPUT_PARSE_ERROR: 500,
  ERROR: 500,
  NOT_AUTHORIZED: 401,
  TIMEOUT: 504,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  METHOD_NOT_SUPPORTED: 405,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  INSUFFICIENT_CREDITS: 402,
  PAYMENT_REQUIRED: 402,
} as const;

export class ApiError extends Error {
  /** the Error object thrown */
  readonly data: unknown;
  /** the error code */
  readonly code: keyof typeof ERROR_CODES;

  constructor(
    code: keyof typeof ERROR_CODES = ERROR_CODES.ERROR,
    data?: unknown
  ) {
    super();
    this.data = data;
    this.code = code;

    if (data instanceof Error) {
      this.message = data.message;
      this.stack = data.stack;
      this.name = data.name;
      this.cause = data.cause;
    }
    if (!this.message && typeof this.data === 'string') {
      this.message = this.data;
    }
    if (!this.name) {
      this.name = 'ApiError';
    }
  }
}
