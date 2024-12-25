import { FloatField } from '@/components/form';
import type { BaseFieldProps } from '@/components/form';
import { type ComponentProps, useEffect } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

export type FloatBetweenFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<'input'>, keyof BaseFieldProps<T>>;

export const FloatBetweenField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes,
}: FloatBetweenFieldProps<T>) => {
  const triggerValidation = () => {
    form.trigger(name);
  };

  useEffect(() => {
    return () => {
      form.unregister(`${name}.min` as Path<T>);
      form.unregister(`${name}.max` as Path<T>);
    };
  }, []);

  return (
    <div className="flex gap-2">
      <FloatField
        form={form}
        name={`${name}.min` as Path<T>}
        placeholder="Min value"
        hideErrorMessageCodes={hideErrorMessageCodes}
        onChange={triggerValidation}
      />

      <FloatField
        form={form}
        name={`${name}.max` as Path<T>}
        placeholder="Max value"
        hideErrorMessageCodes={hideErrorMessageCodes}
        onChange={triggerValidation}
      />
    </div>
  );
};
