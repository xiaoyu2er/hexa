import type { BaseFieldProps } from '@/components/form/form-type';

import { FormField } from '@hexa/ui/form';
import { DatePicker, type DatePickerProps } from '@nextui-org/react';
import {} from 'lodash';
import type { FieldValues } from 'react-hook-form';

export type TimeFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<DatePickerProps, keyof BaseFieldProps<T>>;
import {
  type ZonedDateTime,
  fromDate,
  getLocalTimeZone,
} from '@internationalized/date';

export const TimeField = <T extends FieldValues = FieldValues>({
  form,
  name,
  className,
  hideErrorMessageCodes = ['invalid_date'],
  ...props
}: TimeFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const fieldValue: string | undefined = field.value;
        return (
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            isInvalid={!!error}
            errorMessage={
              error?.type &&
              error?.message &&
              !hideErrorMessageCodes?.includes(error.type)
                ? error.message
                : undefined
            }
            onChange={(value: ZonedDateTime) => {
              field.onChange(value.toDate().toISOString());
            }}
            // @ts-ignore
            value={
              fieldValue
                ? fromDate(new Date(fieldValue), getLocalTimeZone())
                : null
            }
            variant="bordered"
            {...props}
          />
        );
      }}
    />
  );
};
