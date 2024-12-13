import type { BaseFieldProps } from '@/components/form/form-type';
import {
  type SelectOption,
  type SelectOptions,
  isSelectOptionGroup,
} from '@hexa/const/select-option';
import { Icon } from '@iconify/react';

import { Select, SelectItem, SelectSection } from '@nextui-org/react';
import type { SelectProps } from '@nextui-org/react';
import { type ReactNode, useState } from 'react';
import { type FieldValues, useController } from 'react-hook-form';

type BaseSelectFieldProps = {
  placeholder?: string;
  options: SelectOptions;
  className?: string;
  selectItemStartContent?: (option: SelectOption) => ReactNode;
  showClear?: boolean;
};

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  BaseSelectFieldProps &
  Omit<SelectProps, keyof BaseFieldProps<T> | 'children'> & {
    onChange?: (value: string | string[]) => void;
  };

export const SelectField = <T extends FieldValues = FieldValues>({
  form,
  name,
  className,
  selectionMode,
  options,
  selectItemStartContent,
  onChange,
  showClear,
  hideErrorMessageCodes = ['invalid_type'],
  ...props
}: SelectFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control: form.control,
    name,
  });

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

  return (
    <Select
      aria-label={field.name}
      maxListboxHeight={308}
      endContent={
        showClear &&
        (selectionMode === 'multiple' ? field.value.length : field.value) ? (
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
        if (selectionMode === 'multiple') {
          const valueArray = [...value];
          field.onChange(valueArray);
          onChange?.(valueArray);
        } else {
          const val = [...value][0];
          if (val) {
            field.onChange(val);
            onChange?.(val);
          }
        }
      }}
      {...props}
    >
      {filterOptions(options).map((option) => {
        if (isSelectOptionGroup(option)) {
          return (
            <SelectSection showDivider title={option.label} key={option.label}>
              {option.options.map((groupOption) => (
                <SelectItem
                  key={groupOption.value}
                  startContent={selectItemStartContent?.(groupOption)}
                  aria-label={groupOption.label}
                >
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
            aria-label={option.label}
          >
            {option.label}
          </SelectItem>
        );
      })}
    </Select>
  );
};
