import type { BaseFieldProps } from '@/components/form/form-type';
import {
  type SelectOption,
  type SelectOptions,
  isSelectOptionGroup,
} from '@hexa/const/select-option';
import { FormField } from '@hexa/ui/form';
import { Icon } from '@iconify/react';

import { Select, SelectItem, SelectSection } from '@nextui-org/react';
import type { SelectProps } from '@nextui-org/react';
import { type ReactNode, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

type BaseSelectFieldProps = {
  placeholder?: string;
  options: SelectOptions;
  className?: string;
  selectItemStartContent?: (option: SelectOption) => ReactNode;
  showClear?: boolean;
};

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  BaseSelectFieldProps &
  Omit<SelectProps, keyof BaseFieldProps<T> | 'children'>;

export const SelectField = <T extends FieldValues = FieldValues>({
  form,
  name,
  className,
  selectionMode,
  options,
  selectItemStartContent,
  showClear,
  hideErrorMessageCodes = ['invalid_type'],
  ...props
}: SelectFieldProps<T>) => {
  const [searchTerm, _setSearchTerm] = useState('');

  const filterOptions = (options: SelectOptions) => {
    return options
      .map((option) => {
        if (isSelectOptionGroup(option)) {
          const filteredGroupOptions = option.options.filter(
            (groupOption) =>
              groupOption.label
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              groupOption.value.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return filteredGroupOptions.length > 0
            ? { ...option, options: filteredGroupOptions }
            : null;
        }
        return option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
          ? option
          : null;
      })
      .filter(Boolean) as SelectOptions;
  };

  // const watchValue = form.watch(name);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Select
          endContent={
            showClear &&
            (selectionMode === 'multiple'
              ? field.value.length
              : field.value) ? (
              <Icon
                icon="material-symbols-light:close-small"
                height="20"
                width="20"
                onClick={() => {
                  field.onChange(selectionMode === 'multiple' ? [] : '');
                }}
              />
            ) : undefined
          }
          isInvalid={!!error}
          selectionMode={selectionMode}
          errorMessage={
            error?.type &&
            error?.message &&
            !hideErrorMessageCodes?.includes(error.type)
              ? error.message
              : undefined
          }
          selectedKeys={
            field.value
              ? // biome-ignore lint/nursery/noNestedTernary: <explanation>
                selectionMode === 'multiple'
                ? new Set(field.value)
                : new Set([field.value])
              : new Set()
          }
          variant="bordered"
          onSelectionChange={(value) => {
            return field.onChange(
              selectionMode === 'multiple' ? [...value] : [...value][0]
            );
          }}
          {...props}
        >
          {filterOptions(options).map((option) => {
            if (isSelectOptionGroup(option)) {
              return (
                <SelectSection showDivider title={option.label}>
                  {option.options.map((groupOption) => (
                    <SelectItem
                      key={groupOption.value}
                      startContent={selectItemStartContent?.(groupOption)}
                    >
                      {/* {groupOption.icon && (
                        <groupOption.icon className="mr-2 h-4 w-4" />
                      )} */}
                      {groupOption.label}
                    </SelectItem>
                  ))}
                </SelectSection>
              );
            }

            return (
              <SelectItem
                key={option.value}
                startContent={selectItemStartContent?.(option)}
              >
                {/* {option.icon && <option.icon className="mr-2 h-4 w-4" />} */}
                {option.label}
              </SelectItem>
            );
          })}
        </Select>
      )}
    />
  );
};
