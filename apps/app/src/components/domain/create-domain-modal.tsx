'use client';

import { $createDomain } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { Button } from '@hexa/ui/button';
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';

import { Dialog } from '@/components/dialog';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { queryOrgsOptions } from '@/lib/queries/orgs';
import {
  InsertDomainSchema,
  type InsertDomainType,
} from '@/server/schema/domain';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import {} from '@hexa/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export const CreateDomainModal = NiceModal.create(
  (project: SelectProjectType) => {
    const modal = useModal();
    const {
      data: { data: orgs } = { data: [], rowCount: 0 },
    } = useQuery(queryOrgsOptions);
    const form = useForm<InsertDomainType>({
      resolver: zodResolver(InsertDomainSchema),
      defaultValues: {
        orgId: project.org.id,
      },
    });

    const {
      handleSubmit,
      setError,
      formState: { isSubmitting, errors },
    } = form;

    const { mutateAsync: createDomain } = useMutation({
      mutationFn: $createDomain,
      onError: (err) => {
        setFormError(err, setError);
        modal.reject(err);
      },
      onSuccess: () => {
        modal.resolve();
        modal.remove();
      },
    });

    return (
      <Dialog control={modal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add domain</DialogTitle>
            <DialogDescription>
              Add a new domain to your organization
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) => createDomain({ json }))}
              method="POST"
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
                <SelectField
                  form={form}
                  name="orgId"
                  label="Owner"
                  placeholder="Select an owner"
                  options={orgs?.map((org) => ({
                    label: org.name,
                    value: org.id,
                  }))}
                />

                <InputField
                  form={form}
                  name="hostname"
                  label="Hostname"
                  placeholder="s.example.com"
                />

                <FormErrorMessage message={errors.root?.message} />
              </DialogBody>

              <DialogFooter>
                <Button className="w-full" type="submit" loading={isSubmitting}>
                  Add Domain
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
