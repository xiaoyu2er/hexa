import type { BaseFieldProps } from '@/components/form/form-type';
import { RegexExpressionTips, RegexFlagsTips } from '@/components/tips/regex';
import { Button } from '@hexa/ui/button';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { CircleHelpIcon } from '@hexa/ui/icons';
import { Input } from '@hexa/ui/input';
import { Popover, PopoverTrigger } from '@hexa/ui/popover';
import { cn } from '@hexa/utils/cn';
import type { ComponentProps } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

export type RegexFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<'input'>, keyof BaseFieldProps<T>>;

export const RegexField = <T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  type,
  formItemClassName,
  className,
  hideErrorMessageCodes,
  ...props
}: RegexFieldProps<T>) => {
  return (
    <FormItem className={formItemClassName}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FormField
            control={form.control}
            name={`${name}.0` as Path<T>}
            render={({ field, fieldState }) => (
              <>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={type}
                      placeholder="Regex expression"
                      className={cn(
                        'pr-8',
                        fieldState.error ? 'border-destructive' : '',
                        className
                      )}
                      {...props}
                    />
                    <RegexExpressionTips />
                  </div>
                </FormControl>
                {fieldState.error &&
                  !hideErrorMessageCodes?.includes(fieldState.error.type) && (
                    <FormMessage />
                  )}
              </>
            )}
          />
        </div>

        <div className="relative w-[100px]">
          <FormField
            control={form.control}
            name={`${name}.1` as Path<T>}
            render={({ field, fieldState }) => (
              <>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Flags"
                      className={cn(
                        'pr-8',
                        fieldState.error ? 'border-destructive' : '',
                        className
                      )}
                      {...props}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                          <CircleHelpIcon
                            className="h-4 w-4 text-muted-foreground"
                            aria-label="About regex flags"
                          />
                        </Button>
                      </PopoverTrigger>
                      <RegexFlagsTips />
                    </Popover>
                  </div>
                </FormControl>
                {fieldState.error &&
                  !hideErrorMessageCodes?.includes(fieldState.error.type) && (
                    <FormMessage />
                  )}
              </>
            )}
          />
        </div>
      </div>
    </FormItem>
  );
};
