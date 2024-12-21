import { InputField } from '@/components/form';
import type { BaseFieldProps } from '@/components/form';
import { PlusIcon, TrashIcon } from '@hexa/ui/icons';
import { Button, type InputProps } from '@nextui-org/react';
import {
  type ArrayPath,
  type FieldError,
  type FieldErrors,
  type FieldPathValue,
  type FieldValues,
  type Path,
  useController,
  useFieldArray,
} from 'react-hook-form';

/**
 * MultiInputField handles array of string values (string[]) in forms.
 *
 * Implementation Strategy:
 * 1. External Interface: The form field maintains a string[] type for compatibility
 *    with form schemas and validation.
 *
 * 2. Internal Implementation: We use useFieldArray which requires array items to be objects.
 *    To bridge this gap, we:
 *    - Create an internal field (`${name}_internal`) that stores array of objects: {value: string}[]
 *    - Convert between string[] <-> {value: string}[] when reading/writing form values
 *    - Sync the internal object array with the external string array on every change
 *
 * 3. Benefits:
 *    - Leverages useFieldArray's built-in array manipulation and unique key generation
 *    - Maintains type safety and proper error handling
 *    - Preserves external string[] interface for form validation
 *    - Provides stable keys for React rendering
 *
 * Note: This dual-field approach is necessary because useFieldArray doesn't support
 * primitive arrays directly, but our form schema expects string[].
 *
 * @see https://react-hook-form.com/docs/usefieldarray
 */

// Define the internal field array item type
type InternalFieldArrayItem = {
  value: string;
};

export type MultiInputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<InputProps, keyof BaseFieldProps<T>>;

export const MultiInputField = <T extends FieldValues = FieldValues>({
  form,
  name,
  hideErrorMessageCodes = ['invalid_type'],
  ...props
}: MultiInputFieldProps<T>) => {
  // Get the string[] value and error state from the form
  const {
    field: { value: stringArrayValue },
    fieldState: { error },
  } = useController({
    control: form.control,
    name,
  });

  // Create a separate field array name for the internal object representation
  const internalArrayName = `${name}_internal` as Path<T>;

  // Initialize the internal object array if needed
  if (form.getValues(name) && !form.getValues(internalArrayName)) {
    const initialObjects: InternalFieldArrayItem[] = (
      (stringArrayValue as string[]) || []
    ).map((str) => ({ value: str }));
    form.setValue(
      internalArrayName,
      initialObjects as FieldPathValue<T, Path<T>>
    );
  }

  // useEffect(() => {
  //   updateInternalArray(form.getValues(name));
  // }, [form.getValues(name)]);

  // Use useFieldArray with the internal object array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: internalArrayName as ArrayPath<T>,
  });

  // Update the original string[] whenever the internal array changes
  const updateStringArray = (newFields: InternalFieldArrayItem[]) => {
    const stringArray = newFields.map((f) => f.value);
    form.setValue(name, stringArray as FieldPathValue<T, Path<T>>);
  };

  // Cast error to proper type for array fields
  const arrayError = error as
    | FieldErrors<{ [key: number]: FieldError }>
    | undefined;

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <InputField
          key={field.id}
          form={form}
          name={`${internalArrayName}.${index}.value` as Path<T>}
          {...props}
          // Pass array item error if it exists
          isInvalid={!!arrayError?.[index]?.message}
          errorMessage={
            arrayError?.[index] &&
            hideErrorMessageCodes.includes(
              arrayError[index].type as FieldError['type']
            )
              ? undefined
              : arrayError?.[index]?.message?.toString()
          }
          onChange={(e) => {
            const value = e.target.value as FieldPathValue<T, Path<T>>;
            form.setValue(
              `${internalArrayName}.${index}.value` as Path<T>,
              value
            );
            form.setValue(`${name}.${index}` as Path<T>, value);
            // Trigger validation on the original field
            form.trigger(name);
          }}
          endContent={
            <Button
              type="button"
              variant="light"
              isIconOnly
              size="sm"
              aria-label="Remove value"
              onPress={() => {
                remove(index);
                updateStringArray(
                  form
                    .getValues(internalArrayName)
                    .filter((_: unknown, i: number) => i !== index)
                );
                // Trigger validation after removal
                form.trigger(name);
              }}
              className="hidden h-10 w-10 shrink-0 p-0 sm:flex"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          }
        />
      ))}
      <Button
        type="button"
        variant="bordered"
        className="w-full"
        size="sm"
        isIconOnly
        color={error?.message ? 'danger' : 'default'}
        onPress={() => {
          append({ value: '' } as FieldPathValue<T, Path<T>>);
          updateStringArray([
            ...form.getValues(internalArrayName),
            { value: '' },
          ]);
          // Trigger validation after adding new item
          form.trigger(name);
        }}
      >
        <PlusIcon className="h-4 w-4" />
        Add value
      </Button>
    </div>
  );
};
