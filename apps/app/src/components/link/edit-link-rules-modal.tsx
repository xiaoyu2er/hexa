'use client';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { RuleCard } from '@/components/link/rule-card';
import {
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {} from '@dnd-kit/sortable';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  type LinkRule,
  type LinkRuleCondition,
  type RulesFormType,
  RulesSchema,
} from '@hexa/const/rule';
import { Button } from '@hexa/ui/button';
import { Form } from '@hexa/ui/form';
import { PlusIcon } from '@hexa/ui/icons';
import {} from '@hexa/ui/responsive-dialog';
import { ScrollArea } from '@hexa/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useFieldArray, useForm } from 'react-hook-form';

export const EditLinkRulesModal = NiceModal.create(
  ({ rules = [] }: { rules: LinkRule[] }) => {
    const modal = useModal();

    const form = useForm<RulesFormType>({
      resolver: zodResolver(RulesSchema),
      shouldFocusError: false,
      defaultValues: {
        rules,
      },
    });

    const {
      handleSubmit,
      formState: { errors },
    } = form;
    const { fields, append, remove, swap } = useFieldArray({
      name: 'rules',
      control: form.control,
    });
    // https://docs.dndkit.com/presets/sortable

    const _sensors = useSensors(
      useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
          distance: 10,
        },
      }),
      useSensor(TouchSensor, {
        // Press delay of 250ms, with tolerance of 5px of movement
        activationConstraint: {
          delay: 250,
          tolerance: 5,
        },
      })
    );

    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);

        // const newFileds = arrayMove(fields, oldIndex, newIndex);
        // console.log(newFileds.map((field) => field.id));
        swap(oldIndex, newIndex);
      }
    }

    return (
      <Modal
        isOpen={modal.visible}
        onOpenChange={(v) => {
          if (!v) {
            modal.remove();
          }
        }}
        size="4xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="font-medium text-lg">Configure Routing Rules</p>
            <p className="text-muted-foreground text-sm">
              <p>Add rules to route visitors to different destinations</p>
              <p className="text-xs">
                Rules are evaluated in order. The first matching rule will be
                used. If no rules match, the default destination URL will be
                used.
              </p>
            </p>
          </ModalHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit((data) => {
                modal.resolve(data.rules);
                modal.remove();
              })}
              className="space-y-4"
            >
              <ModalBody>
                <div className="space-y-4">
                  <div className="sticky top-0 z-10 flex justify-end bg-background pt-2 pb-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          conditions: [
                            {
                              field: undefined,
                              operator: undefined,
                              value: undefined,
                            } as unknown as LinkRuleCondition,
                          ],
                          destUrl: '',
                        })
                      }
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Rule
                    </Button>
                  </div>

                  <ScrollArea className="h-[60vh] pb-2">
                    <div className="space-y-4">
                      {/* <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={fields}
                          strategy={verticalListSortingStrategy}
                        > */}
                      {fields.map((field, ruleIndex) => (
                        <RuleCard
                          key={field.id}
                          id={field.id}
                          field={field}
                          ruleIndex={ruleIndex}
                          form={form}
                          onRemove={() => remove(ruleIndex)}
                        />
                      ))}
                      {/* </SortableContext>
                      </DndContext> */}

                      {fields.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm">
                          No rules added yet
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <FormErrorMessage message={errors.root?.message} />
              </ModalBody>

              <ModalFooter>
                <Button type="submit">Save Rules</Button>
              </ModalFooter>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    );
  }
);
