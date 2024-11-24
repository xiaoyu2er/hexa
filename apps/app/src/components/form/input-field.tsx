import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import { get } from 'lodash';
import type { ComponentProps, ReactNode } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type BaseInputFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: ReactNode;
};

export type InputFieldProps<T extends FieldValues> = BaseInputFieldProps<T> &
  Omit<ComponentProps<'input'>, keyof BaseInputFieldProps<T>>;

const InputProps = {
  email: {
    placeholder: 'email@example.com',
    autoComplete: 'email',
    type: 'email',
  },
  password: {
    placeholder: '********',
    autoComplete: 'current-password',
  },
} as const;

export const InputField = <T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  type,
  ...props
}: InputFieldProps<T>) => {
  const otherProps = InputProps[type as keyof typeof InputProps] ?? {};

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              type={type}
              {...otherProps}
              className={
                get(form.formState.errors, name) ? 'border-destructive' : ''
              }
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
