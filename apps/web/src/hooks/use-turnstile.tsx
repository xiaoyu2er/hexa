import { useRef, useState } from "react";
import { FieldValues, UseFormSetError, UseFormSetValue } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";

export function useTurnstile<T extends FieldValues = FieldValues>(
  setError: UseFormSetError<T>,
  setValue: UseFormSetValue<T>
) {
  const ref = useRef();
  const { theme } = useTheme();

  const [turnstileClientError, setClientError] = useState<string | undefined>();

  const resetTurnstile = () => {
    // turnstile response could be only used once
    // @ts-ignore
    ref.current?.reset();
    setClientError(undefined);
  };

  const turnstile = (
    <Turnstile
      ref={ref}
      options={{ size: "auto", theme }}
      siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
      onError={(err: string) => {
        // https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/
        console.error("cf-turnstile-error", err);
        setClientError(err);
        // Error code family 300*** and 600*** (e.g. “600010: The generic_challenge_failure”)
        // is a response generated by the Turnstile in situations where a potential bot or unusual visitor behavior is detected.
        setError("root", {
          message:
            process.env.NODE_ENV === "development"
              ? `[dev][client-side] Cloudflare Turnstile failed - ${err}`
              : "Only humans are allowed to login. Please try again.",
        });
      }}
      onSuccess={() => {
        // @ts-ignore
        const res = ref.current?.getResponse();
        console.log("cf-turnstile-response", res);
        // @ts-ignore
        setValue("cf-turnstile-response", res);
      }}
    />
  );

  return {
    resetTurnstile,
    turnstile,
    hasTurnstileClientError: !!turnstileClientError,
  };
}
