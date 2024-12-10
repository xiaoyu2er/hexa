import type { BaseFieldProps } from '@/components/form/form-type';
import { InputField } from '@/components/form/input-field';
import { RegexExpressionTips, RegexFlagsTips } from '@/components/tips/regex';
import {} from '@hexa/ui/form';
import {} from '@hexa/ui/popover';
import type { ComponentProps } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

export type RegexFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<'input'>, keyof BaseFieldProps<T>>;

export const RegexField = <T extends FieldValues = FieldValues>({
  form,
  name,
  type,
  className,
  hideErrorMessageCodes,
  ...props
}: RegexFieldProps<T>) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <InputField
          form={form}
          name={`${name}.0` as Path<T>}
          placeholder="Regex expression"
        />
        <RegexExpressionTips />
      </div>

      <div className="relative w-[100px]">
        <InputField
          form={form}
          name={`${name}.1` as Path<T>}
          placeholder="Flags"
        />
        <RegexFlagsTips />
      </div>
    </div>
  );
};
