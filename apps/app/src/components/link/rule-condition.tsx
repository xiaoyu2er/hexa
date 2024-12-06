'use client';

import { InputField } from '@/components/form/input-field';
import { MultiSelectField } from '@/components/form/multi-select-field';
import { SelectField } from '@/components/form/select-field';
import { TimeField } from '@/components/form/time-field';
import {
  FIELD_OPERATOR_CONFIGS,
  type LinkRuleCondition,
  RULE_FIELD_SELECT_OPTIONS,
  RULE_OPERATORS,
  type RuleField,
  type RuleOperator,
  type RulesFormType,
} from '@hexa/const/rule';
import { Button } from '@hexa/ui/button';
import { TrashIcon } from '@hexa/ui/icons';
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
  const fieldConfig = FIELD_OPERATOR_CONFIGS[fieldValue as RuleField] ?? {
    operators: [],
    valueType: () => 'INPUT',
    valueOptions: () => [],
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
      if (operatorValue === 'IN' || operatorValue === 'NOT_IN') {
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
    if (operatorValue === 'IN' || operatorValue === 'NOT_IN') {
      newDefaultValue = [];
    }

    onUpdate({
      field: fieldValue as RuleField,
      operator: '' as unknown as RuleOperator,
      value: newDefaultValue,
    } as LinkRuleCondition);
  }
  // }, [prevFieldValue, fieldValue, operatorValue, onUpdate]);

  const valueInputType = fieldConfig.valueType(
    operatorValue as RuleOperator,
    conditions
  );

  const valueOptions = fieldConfig.valueOptions?.(conditions) ?? [];

  let valueInput = (
    <InputField form={form} name={valueName} placeholder="Enter value" />
  );
  if (valueInputType === 'TIME') {
    valueInput = <TimeField key="time" form={form} name={valueName} />;
  } else if (valueInputType === 'MULTI_SELECT') {
    valueInput = (
      <MultiSelectField
        form={form}
        name={valueName}
        options={valueOptions}
        placeholder="Select options..."
      />
    );
  } else if (valueInputType === 'SELECT') {
    valueInput = (
      <SelectField
        form={form}
        name={valueName}
        options={valueOptions}
        placeholder="Select value"
      />
    );
  }
  return (
    <div className="space-y-2 sm:grid sm:grid-cols-[180px,180px,1fr,auto] sm:gap-2 sm:space-y-0">
      <div className="flex gap-2">
        <div className="flex-1">
          <SelectField
            form={form}
            name={filedKey}
            options={RULE_FIELD_SELECT_OPTIONS}
            placeholder="Select field"
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
