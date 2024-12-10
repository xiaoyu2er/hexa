'use client';
import { RuleCondition } from '@/components/link/rule-condition';
import type { LinkRuleCondition, RulesFormType } from '@hexa/const/rule';
import { Button } from '@hexa/ui/button';
import { PlusIcon } from '@hexa/ui/icons';
import React from 'react';
import { useFieldArray, type useForm } from 'react-hook-form';

export const RuleConditions = ({
  ruleIndex,
  form,
}: {
  ruleIndex: number;
  form: ReturnType<typeof useForm<RulesFormType>>;
}) => {
  const {
    fields: conditions,
    append,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: `rules.${ruleIndex}.conditions`,
  });
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h5 className="font-medium text-sm">Conditions</h5>
        <p className="text-muted-foreground text-xs">
          When all conditions below are met, the link will redirect to the
          destination URL
        </p>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
        {conditions.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            No conditions added yet
          </p>
        ) : null}
        {conditions.map((condition, condIndex) => {
          return (
            <React.Fragment key={condition.id}>
              <RuleCondition
                formKey={`rules.${ruleIndex}.conditions.${condIndex}`}
                form={form}
                condition={condition}
                onRemove={() => remove(condIndex)}
                conditions={conditions}
                onUpdate={(value) => update(condIndex, value)}
              />
              {condIndex !== conditions.length - 1 && (
                <div className="my-3 flex items-center gap-2 px-2 sm:my-2">
                  <div className="h-px flex-grow bg-border" />
                  <span className="font-medium text-muted-foreground text-xs">
                    AND
                  </span>
                  <div className="h-px flex-grow bg-border" />
                </div>
              )}
            </React.Fragment>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              field: '',
              operator: '',
              value: '',
            } as unknown as LinkRuleCondition)
          }
          className="w-full"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      </div>
    </div>
  );
};
