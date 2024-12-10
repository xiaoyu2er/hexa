'use client';

import { InputField } from '@/components/form/input-field';
import { RegexField } from '@/components/form/regex-field';
import { SelectField } from '@/components/form/select-field';
import { TimeField } from '@/components/form/time-field';
import {
  FIELD_CONFIGS,
  type LinkRuleCondition,
  RULE_FIELD_SELECT_OPTIONS,
  RULE_OPERATORS,
  type RuleField,
  type RuleOperator,
  type RulesFormType,
} from '@hexa/const/rule';
import type { SelectOptions } from '@hexa/const/select-option';
import { Button } from '@hexa/ui/button';
import { TrashIcon } from '@hexa/ui/icons';
import { Avatar } from '@nextui-org/react';
import { usePrevious } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import type { Path, useForm } from 'react-hook-form';

export const RuleCondition = ({
  formKey,
  form,
  conditions,
  onRemove,
  onUpdate,
}: {
  conditions: LinkRuleCondition[];
  condition: LinkRuleCondition;
  formKey: string;
  form: ReturnType<typeof useForm<RulesFormType>>;
  onRemove: () => void;
  onUpdate: (value: LinkRuleCondition) => void;
}) => {
  const filedKey = `${formKey}.field` as Path<RulesFormType>;
  const fieldValue = form.watch(filedKey) as RuleField;
  const prevFieldValue = usePrevious(fieldValue);
  const fieldConfig = FIELD_CONFIGS[fieldValue as RuleField] ?? {
    operators: [],
    valueType: () => ({ type: 'INPUT' }),
  };

  const operatorSelectOptions = fieldConfig.operators.map((operator) => {
    return {
      label: RULE_OPERATORS[operator],
      value: operator,
    };
  });
  const operatorKey = `${formKey}.operator` as Path<RulesFormType>;
  const operatorValue = form.watch(operatorKey) as RuleOperator;
  const prevOperatorValue = usePrevious(operatorValue);
  const valueName = `${formKey}.value` as Path<RulesFormType>;

  useEffect(() => {
    if (prevOperatorValue && operatorValue !== prevOperatorValue) {
      let newDefaultValue: undefined | string | string[] = '';
      if (
        operatorValue === 'IN' ||
        operatorValue === 'NOT_IN' ||
        operatorValue === 'REG' ||
        operatorValue === 'NREG'
      ) {
        newDefaultValue = [];
      }

      onUpdate({
        field: fieldValue as RuleField,
        operator: operatorValue,
        value: newDefaultValue,
      } as LinkRuleCondition);
    }
  }, [prevOperatorValue, operatorValue, onUpdate, fieldValue]);

  // useEffect(() => {
  if (prevFieldValue && fieldValue !== prevFieldValue) {
    let newDefaultValue: undefined | string | string[] = '';
    if (
      operatorValue === 'IN' ||
      operatorValue === 'NOT_IN' ||
      operatorValue === 'REG' ||
      operatorValue === 'NREG'
    ) {
      newDefaultValue = [];
    }

    onUpdate({
      field: fieldValue as RuleField,
      operator: '' as unknown as RuleOperator,
      value: newDefaultValue,
    } as LinkRuleCondition);
  }
  // }, [prevFieldValue, fieldValue, operatorValue, onUpdate]);

  const { type: valueInputType, props: valueInputProps } =
    fieldConfig.valueType(operatorValue as RuleOperator, conditions);

  let valueInput = (
    <InputField
      form={form}
      name={valueName}
      placeholder="Enter value"
      hideErrorMessageCodes={['too_small']}
      {...valueInputProps}
    />
  );

  if (valueInputType === 'REGEX') {
    valueInput = (
      <RegexField form={form} name={valueName} {...valueInputProps} />
    );
  } else if (valueInputType === 'TIME') {
    valueInput = (
      <TimeField
        form={form}
        name={valueName}
        hideErrorMessageCodes={['invalid_string']}
      />
    );
  } else if (valueInputType === 'SELECT' || valueInputType === 'MULTI_SELECT') {
    valueInput = (
      <SelectField
        form={form}
        name={valueName}
        showClear={valueInputType === 'MULTI_SELECT'}
        selectionMode={
          valueInputType === 'MULTI_SELECT' ? 'multiple' : 'single'
        }
        {...(valueInputProps as { options: SelectOptions<string> })}
        placeholder={
          valueInputType === 'MULTI_SELECT' ? 'Select options' : 'Select option'
        }
        isVirtualized
        selectItemStartContent={
          fieldValue === 'COUNTRY'
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
  }
  return (
    <div className="flex items-start space-y-2 sm:grid sm:grid-cols-[180px,180px,1fr,auto] sm:gap-2 sm:space-y-0">
      <div className="flex gap-2">
        <div className="flex-1">
          <SelectField
            form={form}
            name={filedKey}
            options={RULE_FIELD_SELECT_OPTIONS}
            placeholder="Select field"
            hideErrorMessageCodes={['invalid_union_discriminator']}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove()}
          className="h-10 w-10 shrink-0 sm:hidden"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <SelectField
        form={form}
        name={operatorKey}
        options={operatorSelectOptions}
        placeholder="Select operator"
        hideErrorMessageCodes={['invalid_enum_value']}
      />
      <div className="min-w-0">{valueInput}</div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove()}
        className="hidden h-10 w-10 shrink-0 sm:flex"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
