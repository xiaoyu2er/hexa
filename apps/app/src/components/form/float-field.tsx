import type { BaseFieldProps } from '@/components/form/form-type';
import { Input, type InputProps } from '@nextui-org/react';
import { type FieldValues, useController } from 'react-hook-form';

export type FloatFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<InputProps, keyof BaseFieldProps<T>> & {
    onChange?: (value: number) => void;
  };

export const FloatField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes = ['invalid_type'],
  onChange,
  ...props
}: FloatFieldProps<T>) => {
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
      type="number"
      value={field.value}
      onChange={(e) => {
        const value = Number.parseFloat(e.target.value);
        field.onChange(value);
        onChange?.(value);
      }}
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
