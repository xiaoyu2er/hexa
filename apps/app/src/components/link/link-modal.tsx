'use client';

import { Dialog } from '@/components/dialog';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { $createLink, $updateLink } from '@/lib/api';
import { setFormError } from '@/lib/form';

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
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { GlobeIcon } from '@hexa/ui/icons';
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
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
      <Dialog control={modal}>
        <DialogContent className="max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create Link' : 'Edit Link'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Create a new link'
                : 'Update the existing link'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) =>
                mode === 'create' ? createLink({ json }) : updateLink({ json })
              )}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-[2fr,1fr] md:px-0">
                <DialogBody className="space-y-4 p-0">
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
                </DialogBody>

                <div className="md:border-l md:pl-6">
                  <h4 className="font-medium">QR Code</h4>
                  <div className="mt-4 flex justify-center rounded-lg border bg-muted/50 p-4">
                    <QRCodeCanvas value={qrCodeUrl} />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    rulesModal
                      .show({ rules })
                      .then((newRules) =>
                        setValue('rules', newRules as LinkRule[])
                      )
                  }
                >
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  Configure Rules
                  {rules.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {rules.length}
                    </Badge>
                  )}
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  {mode === 'create' ? 'Create Link' : 'Update Link'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
