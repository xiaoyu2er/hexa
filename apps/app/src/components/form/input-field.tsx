import type { BaseFieldProps } from '@/components/form/form-type';
import { Input, type InputProps } from '@nextui-org/react';
import { type FieldValues, useController } from 'react-hook-form';

export type InputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<InputProps, keyof BaseFieldProps<T>>;

export const InputField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes = ['invalid_type'],
  ...props
}: InputFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control: form.control,
    name,
  });

  return (
    <Input
      {...field}
      variant="bordered"
      isInvalid={!!error}
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
