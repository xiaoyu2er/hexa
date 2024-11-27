import type { BaseFieldProps } from '@/components/form/form-type';
import { FormControl, FormField, FormItem, FormLabel } from '@hexa/ui/form';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hexa/ui/select';
import { Select } from '@hexa/ui/select';
import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';

type BaseSelectFieldProps = {
  placeholder?: string;
  options: readonly {
    label: string;
    value: string;
  }[];
};

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  BaseSelectFieldProps &
  Omit<ComponentProps<'select'>, keyof BaseFieldProps<T>>;

export const SelectField = <T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  options,
  placeholder,
  formItemClassName,
  ...props
}: SelectFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          {/* @ts-expect-error TODO: fix this */}
          <Select
            {...props}
            onValueChange={field.onChange}
            value={field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};