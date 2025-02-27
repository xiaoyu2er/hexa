import type { BaseFieldProps } from '@/components/form';
import { type TextAreaProps, Textarea } from '@heroui/react';
import { type FieldValues, useController } from 'react-hook-form';

export type TextareaFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<TextAreaProps, keyof BaseFieldProps<T>>;

export const TextareaField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes = ['invalid_type'],
  ...props
}: TextareaFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control: form.control,
    name,
  });

  return (
    <Textarea
      {...field}
      variant="bordered"
      isInvalid={!!error}
      aria-label={name}
      errorMessage={
        error?.type &&
        error?.message &&
        !hideErrorMessageCodes?.includes(error.type)
          ? error.message
          : undefined
      }
      {...props}
    />
  );
};
