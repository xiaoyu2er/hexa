import type { BaseFieldProps } from '@/components/form';
import {
  DateRangePicker,
  type DateRangePickerProps,
  type RangeValue,
} from '@nextui-org/react';
import {} from 'lodash';
import { type FieldValues, useController } from 'react-hook-form';

export type TimeRangeFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<DateRangePickerProps, keyof BaseFieldProps<T>>;
import {
  type ZonedDateTime,
  fromDate,
  getLocalTimeZone,
} from '@internationalized/date';

export const TimeRangeField = <T extends FieldValues = FieldValues>({
  form,
  name,
  className,
  hideErrorMessageCodes = ['invalid_date'],
  ...props
}: TimeRangeFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control: form.control,
    name,
  });

  const fieldValue: string[] | undefined = field.value;
  return (
    <DateRangePicker
      hideTimeZone
      showMonthAndYearPickers
      visibleMonths={2}
      isInvalid={!!error}
      aria-label={name}
      errorMessage={
        error?.type &&
        error?.message &&
        !hideErrorMessageCodes?.includes(error.type)
          ? error.message
          : undefined
      }
      onChange={(value: RangeValue<ZonedDateTime>) => {
        field.onChange([
          value.start.toDate().toISOString(),
          value.end.toDate().toISOString(),
        ]);
      }}
      // @ts-ignore
      value={
        fieldValue?.[0] && fieldValue[1]
          ? {
              start: fromDate(new Date(fieldValue[0]), getLocalTimeZone()),
              end: fromDate(new Date(fieldValue[1]), getLocalTimeZone()),
            }
          : null
      }
      granularity="second"
      variant="bordered"
      {...props}
    />
  );
};
