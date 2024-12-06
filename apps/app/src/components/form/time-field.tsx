import type { BaseFieldProps } from '@/components/form/form-type';
import {
  DateTimePicker,
  type DateTimePickerProps,
} from '@hexa/ui/date-time-picker';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { cn } from '@hexa/utils/cn';
import type { FieldValues } from 'react-hook-form';
export type TimeFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  DateTimePickerProps;

export const TimeField = <T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  formItemClassName,
  className,
  ...props
}: TimeFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        let value: Date | undefined = new Date(field.value);
        if (value.toString() === 'Invalid Date') {
          value = undefined;
        }

        return (
          <FormItem className={formItemClassName}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <DateTimePicker
                {...field}
                value={value}
                onChange={(value) => {
                  const dateStr = new Date(value || '').toISOString();
                  field.onChange(dateStr);
                }}
                className={cn(
                  'w-[280px]',
                  fieldState.error ? 'border-destructive' : '',
                  className
                )}
                {...props}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
