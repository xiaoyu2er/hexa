import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { ZodError } from "zod";
import type { TAnyZodSafeFunctionHandler, inferServerActionError } from "zsa";

export function setFormError3<
  TFieldValues extends FieldValues,
  TServerAction extends TAnyZodSafeFunctionHandler,
>(
  err: inferServerActionError<TServerAction>,
  setError: UseFormSetError<TFieldValues>,
  defaultField: FieldPath<TFieldValues> | `root.${string}` | "root" = "root",
) {
  if (err.code === "INPUT_PARSE_ERROR") {
    for (const [field, message] of Object.entries(err.fieldErrors)) {
      if ((message as string[])[0]) {
        setError(field as FieldPath<TFieldValues>, {
          message: (message as string[])[0],
        });
      }
    }
    if (err.formErrors?.[0]) {
      setError(defaultField, { message: err.formErrors[0] });
    }
  } else {
    setError(defaultField, { message: err.message });
  }
}

export function setFormError<TFieldValues extends FieldValues>(
  err: ZodError | Error,
  setError: UseFormSetError<TFieldValues>,
  defaultField:
    | FieldPath<TFieldValues>
    | `root.${string}`
    | "root"
    | undefined = "root",
) {
  if (err instanceof ZodError) {
    for (const { path, message } of err.issues) {
      // @ts-ignore
      setError(path.join("."), {
        message: message,
      });
    }
  }
  if (err.message) {
    setError(defaultField ?? "root", { message: err.message });
  }
}
