import type { BaseFieldProps } from '@/components/form/form-type';
import {
  type SelectOptions,
  isSelectOptionGroup,
} from '@hexa/const/select-option';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@hexa/ui/select';
import { Select } from '@hexa/ui/select';
import { cn } from '@hexa/utils/cn';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';

type BaseSelectFieldProps = {
  placeholder?: string;
  options: SelectOptions;
  className?: string;
};

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  BaseSelectFieldProps &
  Omit<ComponentProps<'select'>, keyof BaseFieldProps<T>>;

export const SelectField = <T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  options,
  placeholder,
  formItemClassName,
  className,
  ...props
}: SelectFieldProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');

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
      render={({ field, fieldState }) => (
        <FormItem className={formItemClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {/* @ts-expect-error TODO: fix this */}
            <Select
              {...props}
              onValueChange={field.onChange}
              value={field.value?.toString()}
            >
              <SelectTrigger
                className={cn(
                  fieldState.error ? 'border-destructive' : '',
                  className
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                <div className="px-3 pb-2">
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>
                {filterOptions(options).map((option) => {
                  if (isSelectOptionGroup(option)) {
                    return (
                      <SelectGroup
                        key={option.label}
                        className="text-muted-foreground"
                      >
                        <SelectLabel>{option.label}</SelectLabel>
                        {option.options.map((groupOption) => (
                          <SelectItem
                            key={groupOption.value}
                            value={groupOption.value}
                          >
                            {groupOption.icon && (
                              <groupOption.icon className="mr-2 h-4 w-4" />
                            )}
                            {groupOption.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    );
                  }

                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
