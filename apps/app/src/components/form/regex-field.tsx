import type { BaseFieldProps } from '@/components/form/form-type';
import { InputField } from '@/components/form/input-field';
import { RegexExpressionTips, RegexFlagsTips } from '@/components/tips/regex';
import {} from '@hexa/ui/form';
import { useDebounce } from '@hexa/ui/hooks/use-debounce';
import {} from '@hexa/ui/popover';
import type { ComponentProps } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

export type RegexFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<'input'>, keyof BaseFieldProps<T>>;

// Helper to format regex string for display
const unescapeRegex = (pattern: string) => {
  if (!pattern) {
    return undefined;
  }
  try {
    // Create RegExp to see how it actually interprets the pattern
    const regex = new RegExp(pattern);
    // Get the string representation without the flags
    const str = regex.toString();
    // Remove the leading '/', the trailing '/', and the flags
    return str.slice(1, -1);
  } catch (_e) {
    // Return raw preview if RegExp creation fails
    return undefined;
  }
};

export const RegexField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes,
}: RegexFieldProps<T>) => {
  // Watch immediate expression value
  const expression: string = form.watch(`${name}.expression` as Path<T>);
  const flags = form.watch(`${name}.flags` as Path<T>);

  // Create debounced version of expression
  const debouncedExpression = useDebounce(`/${expression}/${flags}`, 1000);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <InputField
            form={form}
            name={`${name}.expression` as Path<T>}
            placeholder="Regex expression"
            hideErrorMessageCodes={hideErrorMessageCodes}
          />
          <RegexExpressionTips className="-translate-y-1/2 absolute top-1/2 right-1" />
        </div>

        <div className="relative w-[100px]">
          <InputField
            form={form}
            name={`${name}.flags` as Path<T>}
            placeholder="Flags"
            hideErrorMessageCodes={hideErrorMessageCodes}
          />
          <RegexFlagsTips className="-translate-y-1/2 absolute top-1/2 right-1" />
        </div>
      </div>

      {/* Preview formatted regex using debounced value */}
      {expression && (
        <div className="text-gray-600 text-sm">
          Preview: /{unescapeRegex(expression)}/{flags}
          <iframe
            key={debouncedExpression}
            title="Regex Preview"
            width="100%"
            height="120"
            src={`https://jex.im/regulex/#!embed=true&flags=${flags}&re=${encodeURIComponent(
              unescapeRegex(expression)
            )}`}
          />
        </div>
      )}
    </div>
  );
};
