import type { BaseFieldProps } from '@/components/form/form-type';
import { InputField } from '@/components/form/input-field';
import { RegexExpressionTips, RegexFlagsTips } from '@/components/tips/regex';
import {} from '@hexa/ui/form';
import {} from '@hexa/ui/popover';
import { type ComponentProps, useEffect } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

export type RegexFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<'input'>, keyof BaseFieldProps<T>>;

export const RegexField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes,
}: RegexFieldProps<T>) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return () => {
      // unregister regex field
      form.unregister(`${name}.0` as Path<T>);
      form.unregister(`${name}.1` as Path<T>);
    };
  }, []);

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <InputField
          form={form}
          name={`${name}.0` as Path<T>}
          placeholder="Regex expression"
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
        <RegexExpressionTips className="-translate-y-1/2 absolute top-1/2 right-1" />
      </div>

      <div className="relative w-[100px]">
        <InputField
          form={form}
          name={`${name}.1` as Path<T>}
          placeholder="Flags"
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
        <RegexFlagsTips className="-translate-y-1/2 absolute top-1/2 right-1" />
      </div>
    </div>
  );
};
