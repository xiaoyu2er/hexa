import type { ReactNode } from 'react';
import type {
  FieldValues,
  LiteralUnion,
  Path,
  RegisterOptions,
  UseFormReturn,
} from 'react-hook-form';

export type BaseFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: ReactNode;
  formItemClassName?: string;
  hideErrorMessageCodes?: LiteralUnion<keyof RegisterOptions, string>[];
};
