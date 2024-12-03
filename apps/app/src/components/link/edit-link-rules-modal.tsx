'use client';

import { Dialog } from '@/components/dialog';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import {
  type LinkRule,
  type LinkRuleOperator,
  LinkRuleSchema,
} from '@/server/schema/link';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { Card } from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { PlusIcon, TrashIcon } from '@hexa/ui/icons';
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const RULE_OPERATORS: { label: string; value: LinkRuleOperator }[] = [
  { label: 'Equals', value: 'EQ' },
  { label: 'Not equals', value: 'NEQ' },
  { label: 'Contains', value: 'CONTAINS' },
  { label: 'Not contains', value: 'NOT_CONTAINS' },
  { label: 'Matches regex', value: 'REG' },
  { label: 'Not matches regex', value: 'NREG' },
];

const RULE_FIELDS = [
  { label: 'Country', value: 'country' },
  { label: 'Device', value: 'device' },
  { label: 'Browser', value: 'browser' },
  { label: 'Language', value: 'language' },
  { label: 'Query param', value: 'query' },
];

const RulesSchema = z.object({
  rules: z.array(LinkRuleSchema),
});

type RulesFormType = z.infer<typeof RulesSchema>;

const RuleConditions = ({
  ruleIndex,
  form,
}: {
  ruleIndex: number;
  form: ReturnType<typeof useForm<RulesFormType>>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `rules.${ruleIndex}.conditions`,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h5 className="font-medium text-sm">Conditions</h5>
          <p className="text-muted-foreground text-xs">
            When all conditions below are met, the link will redirect to the
            destination URL
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ field: '', operator: 'EQ', value: '' })}
        >
          Add Condition
        </Button>
      </div>

      <div className="rounded-lg border p-3">
        {fields.map((condition, condIndex) => (
          <div key={condition.id}>
            <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2">
              <SelectField
                form={form}
                name={`rules.${ruleIndex}.conditions.${condIndex}.field`}
                options={RULE_FIELDS}
                placeholder="Select field"
              />
              <SelectField
                form={form}
                name={`rules.${ruleIndex}.conditions.${condIndex}.operator`}
                options={RULE_OPERATORS}
                placeholder="Select operator"
              />
              <InputField
                form={form}
                name={`rules.${ruleIndex}.conditions.${condIndex}.value`}
                placeholder="Enter value"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(condIndex)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>

            {condIndex < fields.length - 1 && (
              <div className="my-2 flex items-center gap-2 px-2">
                <div className="h-px flex-grow bg-border" />
                <span className="font-medium text-muted-foreground text-xs">
                  AND
                </span>
                <div className="h-px flex-grow bg-border" />
              </div>
            )}
          </div>
        ))}

        {fields.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No conditions added yet
          </p>
        )}
      </div>
    </div>
  );
};

export const EditLinkRulesModal = NiceModal.create(
  ({ rules = [] }: { rules: LinkRule[] }) => {
    const modal = useModal();

    const form = useForm<RulesFormType>({
      resolver: zodResolver(RulesSchema),
      defaultValues: {
        rules,
      },
    });

    const {
      handleSubmit,
      formState: { errors },
    } = form;

    const { fields, append, remove } = useFieldArray({
      name: 'rules',
      control: form.control,
    });

    return (
      <Dialog control={modal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Configure Routing Rules</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>Add rules to route visitors to different destinations</p>
              <p className="text-xs">
                Rules are evaluated in order. The first matching rule will be
                used. If no rules match, the default destination URL will be
                used.
              </p>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit((data) => {
                modal.resolve(data.rules);
                modal.remove();
              })}
              className="space-y-4"
            >
              <DialogBody className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        conditions: [{ field: '', operator: 'EQ', value: '' }],
                        destUrl: '',
                      })
                    }
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, ruleIndex) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              Rule {ruleIndex + 1}
                            </h4>
                            <Badge variant="secondary">
                              {field.conditions?.length || 0} conditions
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(ruleIndex)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <InputField
                          form={form}
                          name={`rules.${ruleIndex}.destUrl`}
                          label="Destination URL"
                        />

                        <RuleConditions ruleIndex={ruleIndex} form={form} />
                      </div>
                    </Card>
                  ))}

                  {fields.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm">
                      No rules added yet
                    </p>
                  )}
                </div>

                <FormErrorMessage message={errors.root?.message} />
              </DialogBody>

              <DialogFooter>
                <Button type="submit">Save Rules</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
