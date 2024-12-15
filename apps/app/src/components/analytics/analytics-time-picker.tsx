import {
  type CalendarDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import {
  Button,
  ButtonGroup,
  DateRangePicker,
  Radio,
  type RadioProps,
  cn,
} from '@nextui-org/react';
import { useLocale } from '@react-aria/i18n';

export default function AnalyticsTimePicker({
  dateRange: value,
  onUpdate: setValue,
}: {
  dateRange: {
    start: CalendarDate;
    end: CalendarDate;
  };
  onUpdate: (dateRange: { start: CalendarDate; end: CalendarDate }) => void;
}) {
  const { locale } = useLocale();
  const now = today(getLocalTimeZone());

  const _CustomRadio = (props: RadioProps) => {
    const { children, ...otherProps } = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            'flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between',
            'cursor-pointer rounded-full border-2 border-default-200/60',
            'data-[selected=true]:border-primary'
          ),
          label: 'text-tiny text-default-500',
          labelWrapper: 'px-1 m-0',
          wrapper: 'hidden',
        }}
      >
        {children}
      </Radio>
    );
  };

  return (
    <DateRangePicker
      className="w-[280px]"
      visibleMonths={2}
      variant="bordered"
      aria-label="Date range picker"
      // CalendarBottomContent={
      //   <RadioGroup
      //     aria-label="Date precision"
      //     classNames={{
      //       base: 'w-full pb-2',
      //       wrapper:
      //         '-my-2.5 py-2.5 px-3 gap-1 flex-nowrap max-w-[w-[calc(var(--visible-months)_*_var(--calendar-width))]] overflow-scroll',
      //     }}
      //     defaultValue="exact_dates"
      //     orientation="horizontal"
      //   >
      //     <CustomRadio value="exact_dates">Exact dates</CustomRadio>
      //     <CustomRadio value="1_day">1 day</CustomRadio>
      //     <CustomRadio value="2_days">2 days</CustomRadio>
      //     <CustomRadio value="3_days">3 days</CustomRadio>
      //     <CustomRadio value="7_days">7 days</CustomRadio>
      //     <CustomRadio value="14_days">14 days</CustomRadio>
      //   </RadioGroup>
      // }
      CalendarTopContent={
        <ButtonGroup
          fullWidth
          className="bg-content1 px-3 pt-3 pb-2 [&>button]:border-default-200/60 [&>button]:text-default-500"
          radius="full"
          size="sm"
          variant="bordered"
        >
          <Button
            onPress={() =>
              setValue({
                start: now.subtract({ days: 1 }),
                end: now,
              })
            }
          >
            Last 24 hours
          </Button>
          <Button
            onPress={() =>
              setValue({ start: now.subtract({ days: 7 }), end: now })
            }
          >
            Last 7 days
          </Button>
          <Button
            onPress={() =>
              setValue({ start: now.subtract({ days: 30 }), end: now })
            }
          >
            Last 30 days
          </Button>
        </ButtonGroup>
      }
      calendarProps={{
        focusedValue: value.start,
        onFocusChange: (val) => setValue({ ...value, start: val }),
        nextButtonProps: {
          variant: 'bordered',
        },
        prevButtonProps: {
          variant: 'bordered',
        },
      }}
      // @ts-ignore
      value={value}
      onChange={(newDate) => {
        setValue(newDate);
      }}
    />
  );
}
