'use client';

import { Dialog } from '@/components/dialog';
import { RuleCard } from '@/components/link/rule-card';
import {
  type LinkRule,
  type RulesFormType,
  RulesSchema,
} from '@/server/schema/link';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { PlusIcon } from '@hexa/ui/icons';
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import { ScrollArea } from '@hexa/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

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
              <DialogBody>
                <div className="space-y-4">
                  <div className="sticky top-0 z-10 flex justify-end bg-background pt-2 pb-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          conditions: [
                            { field: '', operator: 'EQ', value: '' },
                          ],
                          destUrl: '',
                        })
                      }
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Rule
                    </Button>
                  </div>

                  <ScrollArea className="h-[60vh]">
                    <div className="space-y-4 pr-4">
                      {fields.map((field, ruleIndex) => (
                        <RuleCard
                          key={field.id}
                          field={field}
                          ruleIndex={ruleIndex}
                          form={form}
                          onRemove={() => remove(ruleIndex)}
                        />
                      ))}

                      {fields.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm">
                          No rules added yet
                        </p>
                      )}
                    </div>
                  </ScrollArea>
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
