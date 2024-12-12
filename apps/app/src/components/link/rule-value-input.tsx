'use client';

import { FloatBetweenField } from '@/components/form/float-between-field';
import { FloatField } from '@/components/form/float-field';
import { InputField } from '@/components/form/input-field';
import { MultiInputField } from '@/components/form/multi-input-field';
import { RegexField } from '@/components/form/regex-field';
import { SelectField } from '@/components/form/select-field';
import { TimeField } from '@/components/form/time-field';
import { TimeRangeField } from '@/components/form/time-range-field';
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
}: RuleinputProps) => {
  let valueInput: ReactNode;

  switch (inputType) {
    case 'INPUT': {
      valueInput = (
        <InputField
          form={form}
          name={inputName}
          placeholder="Enter value"
          hideErrorMessageCodes={['too_small']}
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
          hideErrorMessageCodes={['invalid_type', 'too_small']}
        />
      );
      break;
    }
    case 'FLOAT_BETWEEN': {
      valueInput = (
        <FloatBetweenField form={form} name={inputName} {...inputProps} />
      );
      break;
    }
    case 'FLOAT': {
      valueInput = <FloatField form={form} name={inputName} {...inputProps} />;
      break;
    }
    case 'REGEX': {
      valueInput = <RegexField form={form} name={inputName} {...inputProps} />;
      break;
    }
    case 'TIME': {
      valueInput = (
        <TimeField
          form={form}
          name={inputName}
          hideErrorMessageCodes={['invalid_string', 'invalid_type']}
        />
      );
      break;
    }
    case 'TIME_BETWEEN': {
      valueInput = (
        <TimeRangeField
          form={form}
          name={inputName}
          hideErrorMessageCodes={['invalid_type']}
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
          hideErrorMessageCodes={[
            'invalid_enum_value',
            'too_small',
            'invalid_type',
          ]}
        />
      );
      break;
    }
    default:
      break;
  }

  return valueInput;
};
