'use client';

import { InputField } from '@/components/form';
import { FloatBetweenField } from '@/components/form';
import { FloatField } from '@/components/form';
import { MultiInputField } from '@/components/form';
import { RegexField } from '@/components/form';
import { SelectField } from '@/components/form';
import { TimeField } from '@/components/form';
import { TimeRangeField } from '@/components/form';
import type { RuleField, RulesFormType } from '@hexa/const/rule';
import type { RuleValueTypeCode } from '@hexa/const/rule-value-type';
import type { SelectOptions } from '@hexa/const/select-option';
import { Avatar, Input } from '@nextui-org/react';
import type { ReactNode } from 'react';
import type { Path, useForm } from 'react-hook-form';

interface RuleinputProps {
  inputType: RuleValueTypeCode;
  inputProps?: Record<string, unknown>;
  inputValue: RuleField;
  inputName: Path<RulesFormType>;
  form: ReturnType<typeof useForm<RulesFormType>>;
  hideErrorMessageCodes?: string[];
}

export const RuleValueInputPlaceholder = () => {
  return <Input variant="bordered" placeholder="Enter value" />;
};

export const RuleValueInput = ({
  inputType,
  inputProps,
  inputValue,
  inputName,
  form,
  hideErrorMessageCodes = ['invalid_type'],
}: RuleinputProps) => {
  let valueInput: ReactNode;

  switch (inputType) {
    case 'INPUT': {
      valueInput = (
        <InputField
          form={form}
          name={inputName}
          placeholder="Enter value"
          hideErrorMessageCodes={hideErrorMessageCodes}
          {...inputProps}
        />
      );
      break;
    }

    case 'MULTI_INPUT': {
      valueInput = (
        <MultiInputField
          form={form}
          name={inputName}
          {...inputProps}
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
      );
      break;
    }
    case 'FLOAT_BETWEEN': {
      valueInput = (
        <FloatBetweenField
          form={form}
          name={inputName}
          {...inputProps}
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
      );
      break;
    }
    case 'FLOAT': {
      valueInput = (
        <FloatField
          form={form}
          name={inputName}
          {...inputProps}
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
      );
      break;
    }
    case 'REGEX': {
      valueInput = (
        <RegexField
          form={form}
          name={inputName}
          {...inputProps}
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
      );
      break;
    }
    case 'TIME': {
      valueInput = (
        <TimeField
          form={form}
          name={inputName}
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
      );
      break;
    }
    case 'TIME_BETWEEN': {
      valueInput = (
        <TimeRangeField
          form={form}
          name={inputName}
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
      );
      break;
    }
    case 'SELECT':
    case 'MULTI_SELECT': {
      valueInput = (
        <SelectField
          form={form}
          name={inputName}
          showClear={inputType === 'MULTI_SELECT'}
          selectionMode={inputType === 'MULTI_SELECT' ? 'multiple' : 'single'}
          {...(inputProps as { options: SelectOptions<string> })}
          placeholder={
            inputType === 'MULTI_SELECT' ? 'Select options' : 'Select option'
          }
          isVirtualized={
            (inputProps as { options: SelectOptions<string> }).options.length >
            10
          }
          selectItemStartContent={
            inputValue === 'COUNTRY'
              ? (option) => (
                  <Avatar
                    alt={option.label}
                    className="h-6 w-6"
                    src={`https://flagcdn.com/${option.value.toLowerCase()}.svg`}
                  />
                )
              : undefined
          }
          hideErrorMessageCodes={hideErrorMessageCodes}
        />
      );
      break;
    }
    default:
      break;
  }

  return valueInput;
};
