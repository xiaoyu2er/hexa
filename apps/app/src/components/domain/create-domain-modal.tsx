'use client';

import { setFormError } from '@/components/form';
import { $createDomain } from '@/lib/api';
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';

import { Dialog } from '@/components/dialog';
import { Form } from '@/components/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { queryOrgsOptions } from '@/lib/queries/orgs';
import {
  InsertDomainSchema,
  type InsertDomainType,
} from '@/server/schema/domain';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
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

          <Form
            form={form}
            onSubmit={handleSubmit((json) => createDomain({ json }))}
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
              <Button
                className="w-full"
                type="submit"
                isLoading={isSubmitting}
                color="primary"
              >
                Add Domain
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
