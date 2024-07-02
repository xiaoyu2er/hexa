// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
// Error code Description
// missing-input-secret	The secret parameter was not passed.
// invalid-input-secret	The secret parameter was invalid or did not exist.
// missing-input-response	The response parameter (token) was not passed.
// invalid-input-response	The response parameter (token) is invalid or has expired. Most of the time, this means a fake token has been used. If the error persists, contact customer support.
// invalid-widget-id	The widget ID extracted from the parsed site secret key was invalid or did not exist.
// invalid-parsed-secret	The secret extracted from the parsed site secret key was invalid.
// bad-request	The request was rejected because it was malformed.
// timeout-or-duplicate	The response parameter (token) has already been validated before. This means that the token was issued five minutes ago and is no longer valid, or it was already redeemed.
// internal-error	An internal error happened while validating the response. The request can be retried.

import { TurnstileSchema } from "@/lib/zod/schemas/auth";
import { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { headers } from "next/headers";
import { ZSAError, createServerActionProcedure } from "zsa";

export const emptyTurnstileProcedure = createServerActionProcedure()
  .input(TurnstileSchema)
  .handler(async () => {
    return {};
  });

export const turnstileProcedure = process.env.DISABLE_CLOUDFLARE_TURNSTILE
  ? emptyTurnstileProcedure
  : createServerActionProcedure()
      .input(TurnstileSchema)
      .handler(async ({ input }) => {
        const form = new URLSearchParams();
        form.append("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY!);
        form.append("response", input["cf-turnstile-response"]!);
        form.append("remoteip", headers().get("x-forwarded-for") as string);

        console.log("turnstile form", form.toString());

        const result = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          { method: "POST", body: form },
        );
        const verifyRes: TurnstileServerValidationResponse =
          await result.json();

        console.log("turnstile response", verifyRes);

        if (verifyRes.success === false) {
          throw new ZSAError(
            "FORBIDDEN",
            process.env.NODE_ENV === "development"
              ? "[dev][server-side] Cloudflare Turnstile failed - " +
                verifyRes["error-codes"][0]
              : "Only humans are allowed to login. Please try again.",
          );
        }
        return {};
      });
