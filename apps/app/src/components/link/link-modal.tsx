'use client';

import { Dialog } from '@/components/dialog';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { $createLink, $updateLink } from '@/lib/api';
import { setFormError } from '@/lib/form';
import {
  InsertLinkSchema,
  type InsertLinkType,
  type LinkRule,
  type SelectLinkType,
  UpdateLinkSchema,
  type UpdateLinkType,
} from '@/server/schema/link';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
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
import { useForm } from 'react-hook-form';
import { EditLinkRulesModal } from './edit-link-rules-modal';

type Props = {
  project: SelectProjectType;
  mode: 'create' | 'update';
  link?: SelectLinkType;
};

export const LinkModal = NiceModal.create(({ project, mode, link }: Props) => {
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
      <DialogContent className="sm:max-w-[425px]">
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
            method={mode === 'create' ? 'POST' : 'PUT'}
            className="md:space-y-4"
          >
            <DialogBody className="space-y-4">
              <div className="space-y-4">
                <InputField form={form} name="title" label="Link Name" />
                <InputField form={form} name="desc" label="Description" />
              </div>

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
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Routing Rules</h4>
                  <p className="text-muted-foreground text-sm">
                    {rules.length} rules configured
                  </p>
                </div>
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
                  Configure Rules
                </Button>
              </div>

              <FormErrorMessage message={errors.root?.message} />
            </DialogBody>

            <DialogFooter>
              <Button className="w-full" type="submit" loading={isSubmitting}>
                {mode === 'create' ? 'Create Link' : 'Update Link'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
