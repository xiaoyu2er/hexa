'use client';

import { $createLink, $updateLink } from '@/lib/api';
import {
  InsertLinkSchema,
  type InsertLinkType,
  type SelectLinkType,
  UpdateLinkSchema,
  type UpdateLinkType,
} from '@/server/schema/link';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import type { LinkRule } from '@hexa/const/rule';

import {
  Form,
  FormErrorMessage,
  InputField,
  SelectField,
  TextareaField,
  setFormError,
} from '@/components/form';

import { GlobeIcon, RefreshCwIcon } from '@hexa/ui/icons';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import { generateSlug } from 'random-word-slugs';
import { useForm } from 'react-hook-form';
import { EditLinkRulesModal } from './edit-link-rules-modal';

export type LinkModalProps = {
  project: SelectProjectType;
  mode: 'create' | 'update';
  link?: SelectLinkType;
};

export const LinkModal = NiceModal.create(
  ({ project, mode, link }: LinkModalProps) => {
    const modal = useModal();
    const rulesModal = useModal(EditLinkRulesModal);

    const form = useForm<InsertLinkType | UpdateLinkType>({
      resolver: zodResolver(
        mode === 'create' ? InsertLinkSchema : UpdateLinkSchema
      ),
      defaultValues: {
        projectId: project.id,
        rules: [],
        // Pre-populate form for edit mode
        ...(mode === 'update' && link
          ? {
              id: link.id,
              title: link.title || '',
              desc: link.desc || '',
              destUrl: link.destUrl,
              domain: link.domain,
              slug: link.slug,
              rules: link.rules || [],
            }
          : {}),
      },
    });

    const {
      handleSubmit,
      setError,
      watch,
      setValue,
      formState: { isSubmitting, errors },
    } = form;

    const rules = watch('rules') || [];
    const qrCodeUrl = `https://${watch('domain')}/${watch('slug')}?qr=1`;

    const { mutateAsync: createLink } = useMutation({
      mutationFn: $createLink,
      onError: (err) => {
        setFormError(err, setError);
        modal.reject(err);
      },
      onSuccess: () => {
        toast.success('Link created successfully');
        modal.resolve();
        modal.remove();
      },
    });

    const { mutateAsync: updateLink } = useMutation({
      mutationFn: $updateLink,
      onError: (err) => {
        setFormError(err, setError);
        modal.reject(err);
      },
      onSuccess: () => {
        toast.success('Link updated successfully');
        modal.resolve();
        modal.remove();
      },
    });

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
            <p className="font-medium text-lg">
              {mode === 'create' ? 'Create Link' : 'Edit Link'}
            </p>
            <p className="font-normal text-muted-foreground text-sm">
              {mode === 'create'
                ? 'Create a new link'
                : 'Update the existing link'}
            </p>
          </ModalHeader>

          <Form
            form={form}
            handleSubmit={handleSubmit((json) =>
              mode === 'create'
                ? // @ts-ignore
                  createLink({ json })
                : // @ts-ignore
                  updateLink({ json })
            )}
          >
            <ModalBody className="space-y-4">
              <div className="flex flex-col gap-6 md:flex-row md:px-0">
                <div className="flex flex-1 flex-col gap-4">
                  <InputField
                    form={form}
                    name="destUrl"
                    labelPlacement="outside"
                    label="Default Destination URL"
                    placeholder="https://example.com"
                  />

                  <div className="flex items-end gap-0">
                    <SelectField
                      form={form}
                      name="domain"
                      label="Link"
                      className="w-[200px]"
                      labelPlacement="outside"
                      classNames={{
                        trigger: ' rounded-r-none',
                      }}
                      placeholder="Select a domain"
                      options={project.domains.map((domain) => ({
                        label: domain,
                        value: domain,
                      }))}
                    />
                    <InputField
                      form={form}
                      name="slug"
                      className="flex-1"
                      placeholder="Slug"
                      labelPlacement="outside"
                      classNames={{
                        inputWrapper: 'border-l-0 rounded-l-none',
                      }}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">/</span>
                        </div>
                      }
                      endContent={
                        <Tooltip content="Generate a random slug">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="h-5 w-5 min-w-5"
                            onClick={() => {
                              setValue(
                                'slug',
                                generateSlug(2, {
                                  format: 'kebab',
                                })
                              );
                            }}
                          >
                            <RefreshCwIcon className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                      }
                    />
                  </div>

                  <InputField
                    form={form}
                    name="title"
                    label="Link Name"
                    labelPlacement="outside"
                    placeholder="(optional)"
                  />
                  <TextareaField
                    form={form}
                    name="desc"
                    label="Description"
                    placeholder="(optional)"
                    labelPlacement="outside"
                  />
                  <FormErrorMessage message={errors.root?.message} />
                </div>

                <div className="w-full md:w-[300px] md:border-l md:pl-6">
                  <h4 className="font-medium">QR Code</h4>
                  <div className="mt-4 flex justify-center rounded-lg border bg-muted/50 p-4">
                    <QRCodeCanvas value={qrCodeUrl} />
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex items-center justify-between sm:justify-between">
              <Button
                type="button"
                variant="bordered"
                onClick={() =>
                  rulesModal
                    .show({ rules })
                    .then((newRules) =>
                      setValue('rules', newRules as LinkRule[])
                    )
                }
              >
                <GlobeIcon className="mr-2 h-4 w-4" />
                Configure Rules &nbsp;
                <Chip color="primary" size="sm" variant="solid" radius="full">
                  {rules.length}
                </Chip>
              </Button>
              <Button type="submit" color="primary" isLoading={isSubmitting}>
                {mode === 'create' ? 'Create Link' : 'Update Link'}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    );
  }
);
