import type { BaseFieldProps } from '@/components/form/form-type';
import { DatePicker, type DatePickerProps } from '@nextui-org/react';
import { type FieldValues, useController } from 'react-hook-form';

export type TimeFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<DatePickerProps, keyof BaseFieldProps<T>>;
import {
  type ZonedDateTime,
  fromDate,
  getLocalTimeZone,
  toCalendarDateTime,
} from '@internationalized/date';

export const TimeField = <T extends FieldValues = FieldValues>({
  form,
  name,
  className,
  hideErrorMessageCodes = ['invalid_date'],
  ...props
}: TimeFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control: form.control,
    name,
  });

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
          ? toCalendarDateTime(
              fromDate(new Date(fieldValue), getLocalTimeZone())
            )
          : null
      }
      aria-label={name}
      granularity="second"
      variant="bordered"
      {...props}
    />
  );
};
