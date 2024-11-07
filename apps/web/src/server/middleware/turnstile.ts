import { DISABLE_CLOUDFLARE_TURNSTILE } from "@/lib/const";
import { ApiError } from "@/lib/error/error";
import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { createMiddleware } from "hono/factory";

export const turnstile = createMiddleware(async (c, next) => {
  if (DISABLE_CLOUDFLARE_TURNSTILE) return next();
  // @ts-ignore
  const body = c.req.valid("json");
  const form = new FormData();
  form.set("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "");
  form.set("response", (body["cf-turnstile-response"] ?? "") as string);
  form.set("remoteip", c.req.header("x-forwarded-for") as string);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form },
  );
  const verifyRes: TurnstileServerValidationResponse = await result.json();

  if (verifyRes.success === false) {
    throw new ApiError(
      "FORBIDDEN",
      process.env.NODE_ENV === "development"
        ? "[dev]Please try to verify that you are a human."
        : "Please try to verify that you are a human.",
    );
  }
  return next();
});
