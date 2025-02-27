'use client';
import { RuleCondition } from '@/components/link/rule-condition';
import { Button } from '@heroui/react';
import type { LinkRuleCondition, RulesFormType } from '@hexa/const/rule';
import { PlusIcon } from '@hexa/ui/icons';
import { Fragment } from 'react';
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

  const onRemove = (index: number) => {
    remove(index);
  };
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
            <Fragment key={condition.id}>
              <RuleCondition
                formKey={`rules.${ruleIndex}.conditions.${condIndex}`}
                form={form}
                key={condition.id}
                onRemove={() => onRemove(condIndex)}
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
            </Fragment>
          );
        })}
        <Button
          type="button"
          variant="bordered"
          size="sm"
          onPress={() =>
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
