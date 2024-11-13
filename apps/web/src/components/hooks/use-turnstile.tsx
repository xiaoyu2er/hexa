/**
 * This hook is used to integrate Cloudflare Turnstile with React Hook Form.
 * @see docs https://docs.page/marsidev/react-turnstile/
 * @see demo https://react-turnstile.vercel.app/basic
 */

import {
  DISABLE_CLOUDFLARE_TURNSTILE,
  IS_DEVELOPMENT,
  NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
} from '@/lib/env';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTheme } from 'next-themes';
import { useRef } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export function useTurnstile<T extends FieldValues>({
  form,
  errorField = 'root',
  onError,
  onSuccess,
}: {
  errorField?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  form: UseFormReturn<T, any, undefined>;
  onError?: (err: string) => void;
  onSuccess?: (res: string) => void;
}) {
  const { setError, setValue, watch } = form;
  const ref = useRef();
  const { theme } = useTheme();
  const resetTurnstile = () => {
    // turnstile response could be only used once
    // @ts-ignore
    ref.current?.reset();
    // @ts-ignore
    setValue('cf-turnstile-response', null);
  };

  const turnstile = DISABLE_CLOUDFLARE_TURNSTILE ? null : (
    <Turnstile
      ref={ref}
      options={{
        size: 'auto',
        // type TurnstileTheme = 'light' | 'dark' | 'auto';
        theme: theme === 'dark' ? 'dark' : 'light',
      }}
      siteKey={NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? ''}
      onError={(err: string) => {
        // Error code family 300*** and 600*** (e.g. “600010: The generic_challenge_failure”)
        // is a response generated by the Turnstile in situations where a potential bot or unusual visitor behavior is detected.
        // @ts-ignore - errorField is a string
        setError(errorField, {
          message: IS_DEVELOPMENT
            ? `[dev][client-side] Cloudflare Turnstile failed - ${err}`
            : 'Only humans are allowed to login. Please try again.',
        });
        onError?.(err);
      }}
      onSuccess={() => {
        // @ts-ignore
        const res = ref.current?.getResponse();
        // @ts-ignore
        setValue('cf-turnstile-response', res);
        onSuccess?.(res);
      }}
    />
  );

  const allowNext = DISABLE_CLOUDFLARE_TURNSTILE
    ? true
    : // @ts-ignore
      !!watch('cf-turnstile-response');

  return {
    resetTurnstile,
    turnstile,
    disableNext: !allowNext,
  };
}
