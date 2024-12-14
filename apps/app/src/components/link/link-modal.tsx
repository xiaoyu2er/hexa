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
  setFormError,
} from '@/components/form';
import { GlobeIcon } from '@hexa/ui/icons';
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
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
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
            className="space-y-4"
          >
            <ModalBody className="space-y-4">
              <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-[2fr,1fr] md:px-0">
                <div className="space-y-4">
                  <InputField
                    form={form}
                    name="destUrl"
                    label="Default Destination URL"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      form={form}
                      name="domain"
                      label="Domain"
                      placeholder="Select a domain"
                      options={project.domains.map((domain) => ({
                        label: domain,
                        value: domain,
                      }))}
                    />
                    <InputField form={form} name="slug" label="Slug" />
                  </div>

                  <InputField form={form} name="title" label="Link Name" />
                  <InputField form={form} name="desc" label="Description" />
                  <FormErrorMessage message={errors.root?.message} />
                </div>

                <div className="md:border-l md:pl-6">
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
