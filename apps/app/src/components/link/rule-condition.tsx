'use client';

import { FloatBetweenField } from '@/components/form/float-between-field';
import { FloatField } from '@/components/form/float-field';
import { InputField } from '@/components/form/input-field';
import { RegexField } from '@/components/form/regex-field';
import { SelectField } from '@/components/form/select-field';
import { TimeField } from '@/components/form/time-field';
import { TimeRangeField } from '@/components/form/time-range-field';
import {
  FIELD_CONFIGS,
  type LinkRuleCondition,
  RULE_OPERATORS,
  type RuleField,
  type RuleOperator,
  type RulesFormType,
  getRuleFieldSelectOptions,
} from '@hexa/const/rule';
import type { SelectOptions } from '@hexa/const/select-option';
import { TrashIcon } from '@hexa/ui/icons';
import { Avatar, Button } from '@nextui-org/react';
import { usePrevious } from '@uidotdev/usehooks';
import type { FieldArrayWithId, Path, useForm } from 'react-hook-form';

export const RuleCondition = ({
  formKey,
  form,
  conditions,
  onRemove,
  onUpdate,
  condition,
}: {
  conditions: LinkRuleCondition[];
  condition: FieldArrayWithId<LinkRuleCondition>;
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

  const operatorSelectOptions = fieldConfig.operators.map(({ operator }) => {
    return {
      label: RULE_OPERATORS[operator],
      value: operator,
    };
  });
  const operatorKey = `${formKey}.operator` as Path<RulesFormType>;
  const operatorValue = form.watch(operatorKey) as RuleOperator;
  const prevOperatorValue = usePrevious(operatorValue);
  const valueName = `${formKey}.value` as Path<RulesFormType>;
  const _valueValue = form.watch(valueName) as
    | string
    | string[]
    | number
    | number[]
    | undefined;

  // update operator and value when field change
  // useEffect(() => {
  if (prevFieldValue && fieldValue !== prevFieldValue) {
    onUpdate({
      field: fieldValue as RuleField,
      operator: fieldConfig.operators[0]?.operator,
      value: fieldConfig.operators[0]?.defaultValue,
    } as LinkRuleCondition);
  }
  // }, [fieldConfig, prevFieldValue, fieldValue, onUpdate]);

  // update value when operator change
  // useEffect(() => {
  if (prevOperatorValue && operatorValue !== prevOperatorValue) {
    const operatorConfig = fieldConfig.operators.find(
      ({ operator }) => operator === operatorValue
    );
    if (!operatorConfig) {
      return;
    }

    onUpdate({
      field: fieldValue as RuleField,
      operator: operatorConfig.operator,
      value: operatorConfig.defaultValue,
    } as LinkRuleCondition);
  }
  // }, [prevOperatorValue, operatorValue, onUpdate, fieldValue, fieldConfig]);

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

  if (valueInputType === 'FLOAT_BETWEEN') {
    valueInput = (
      <FloatBetweenField
        key={`${condition.id}-${valueInputType}`}
        form={form}
        name={valueName}
        {...valueInputProps}
      />
    );
  } else if (valueInputType === 'FLOAT') {
    valueInput = (
      <FloatField form={form} name={valueName} {...valueInputProps} />
    );
  } else if (valueInputType === 'REGEX') {
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
  } else if (valueInputType === 'TIME_BETWEEN') {
    valueInput = <TimeRangeField form={form} name={valueName} />;
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
    <div className="flex w-full flex-col gap-2 sm:grid sm:grid-cols-[180px,180px,1fr,auto] sm:items-start">
      <div className="flex items-center gap-2">
        <SelectField
          form={form}
          name={filedKey}
          options={getRuleFieldSelectOptions(conditions, fieldValue)}
          placeholder="Select field"
          hideErrorMessageCodes={['invalid_union_discriminator']}
          className="min-w-[120px] flex-1"
        />

        <Button
          type="button"
          variant="light"
          isIconOnly
          size="sm"
          aria-label="Remove condition"
          onClick={() => onRemove()}
          className="shrink-0 p-0 sm:hidden"
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
        className="min-w-[120px]"
        onChange={() => {
          // if (
          //   (Array.isArray(valueValue) && valueValue.length) ||
          //   (typeof valueValue === 'string' && valueValue.length) ||
          //   typeof valueValue === 'number'
          // ) {
          //   form.trigger(formKey as Path<RulesFormType>);
          // }
        }}
      />

      <div className="w-full min-w-0">{valueInput}</div>

      <Button
        type="button"
        variant="light"
        isIconOnly
        size="sm"
        aria-label="Remove condition"
        onClick={() => onRemove()}
        className="hidden h-10 w-10 shrink-0 p-0 sm:flex"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
