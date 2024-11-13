import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { ZodError } from 'zod';

// biome-ignore lint/style/useNamingConvention: <explanation>
export function setFormError<TFieldValues extends FieldValues>(
  err: ZodError | Error,
  setError: UseFormSetError<TFieldValues>,
  defaultField:
    | FieldPath<TFieldValues>
    | `root.${string}`
    | 'root'
    | undefined = 'root'
) {
  if (err instanceof ZodError) {
    for (const { path, message } of err.issues) {
      // @ts-ignore
      setError(path.join('.'), {
        message: message,
      });
    }
  }
  if (err.message) {
    setError(defaultField ?? 'root', { message: err.message });
  }
}
