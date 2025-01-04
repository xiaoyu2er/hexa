'use client';

import { setFormError } from '@/components/form';
import { Form } from '@/components/form';
import { FormErrorMessage } from '@/components/form';
import { InputField } from '@/components/form';
import { SelectField } from '@/components/form';
import { useOrgs } from '@/hooks/use-orgs';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { $createDomain } from '@hexa/server/api';
import {
  InsertDomainSchema,
  type InsertDomainType,
} from '@hexa/server/schema/domain';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export const CreateDomainModal = NiceModal.create(
  (project: SelectProjectType) => {
    const modal = useModal();
    const {
      data: { data: orgs } = { data: [], rowCount: 0 },
    } = useOrgs();
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
      <Modal isOpen={modal.visible} onOpenChange={modal.remove}>
        <ModalContent>
          <ModalHeader>Add domain</ModalHeader>
          <Form
            form={form}
            onSubmit={handleSubmit((json) => createDomain({ json }))}
          >
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button
                className="w-full"
                type="submit"
                isLoading={isSubmitting}
                color="primary"
              >
                Add Domain
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    );
  }
);
