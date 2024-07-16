import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import type { TAnyZodSafeFunctionHandler, inferServerActionError } from "zsa";

export function setFormError<
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
