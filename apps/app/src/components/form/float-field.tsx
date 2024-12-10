import type { BaseFieldProps } from '@/components/form/form-type';
import { FormField } from '@hexa/ui/form';
import { Input, type InputProps } from '@nextui-org/react';
import type { FieldValues } from 'react-hook-form';

export type FloatFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<InputProps, keyof BaseFieldProps<T>>;

export const FloatField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes = ['invalid_type'],
  ...props
}: FloatFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          type="number"
          value={field.value}
          onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
      )}
    />
  );
};
