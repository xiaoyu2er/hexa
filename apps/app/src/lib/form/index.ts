import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { ZodError } from 'zod';

export function setFormError<TFieldValues extends FieldValues>(
  err: ZodError | Error,
  setError: UseFormSetError<TFieldValues>,
  defaultField:
    | FieldPath<TFieldValues>
    | `root.${string}`
    | 'root'
    | undefined = 'root',
  onlyUseDefaultField = false
) {
  if (err instanceof ZodError && err.issues.length > 0) {
    if (onlyUseDefaultField) {
      setError(defaultField ?? 'root', { message: err.issues[0]?.message });
    } else {
      for (const { path, message } of err.issues) {
        // @ts-ignore
        setError(path.join('.'), {
          message: message,
        });
      }
    }
  } else if (err.message) {
    setError(defaultField ?? 'root', { message: err.message });
  }
}
