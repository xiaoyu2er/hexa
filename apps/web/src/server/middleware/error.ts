import { ApiError, ERROR_CODE_TO_HTTP_STATUS } from "@/lib/error/error";
import { createMiddleware } from "hono/factory";

const error = createMiddleware(async (c, next) => {
  try {
    console.log("!error middleware");
    await next();
  } catch (error) {
    console.error("!!!!Error in error middleware", error);
    // if (error instanceof ApiError) {
    //   const status = ERROR_CODE_TO_HTTP_STATUS[error.code] ?? 500;
    //   return new Response(
    //     {
    //       error: {
    //         code: error.code,
    //         message: error.message,
    //         data: error.data,
    //       },
    //     },
    //     status
    //   );
    // }
    throw error;
  }
});

export default error;
