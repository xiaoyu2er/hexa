'use client';

import {
  Form,
  FormErrorMessage,
  InputField,
  SelectField,
  setFormError,
} from '@/components/form';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { $createProject } from '@hexa/server/api';
import {
  InsertProjectSchema,
  type InsertProjectType,
} from '@hexa/server/schema/project';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useOrgs } from '@/hooks/use-orgs';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

export const CreateProjectModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();
  const {
    data: { data: orgs } = { data: [], rowCount: 0 },
  } = useOrgs();
  const form = useForm<InsertProjectType>({
    resolver: zodResolver(InsertProjectSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: createProject } = useMutation({
    mutationFn: $createProject,
    onError: (err) => {
      setFormError(err, setError);
      modal.reject(err);
    },
    onSuccess: ({ project }) => {
      toast.success('Project created successfully');
      modal.resolve();
      modal.remove();
      invalidateProjectsQuery();
      router.push(`/project/${project.slug}`);
    },
  });

  return (
    <Modal
      size="lg"
      isOpen={modal.visible}
      backdrop="blur"
      onOpenChange={modal.hide}
    >
      <ModalContent>
        <ModalHeader>Create Project</ModalHeader>
        <Form
          form={form}
          onSubmit={handleSubmit((json) =>
            createProject({ json: { ...json, orgId: json.orgId } })
          )}
          className="md:space-y-4"
        >
          <ModalBody className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
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
                name="slug"
                label="Project Slug"
                placeholder="Enter project slug"
              />
            </div>

            <InputField
              form={form}
              name="name"
              label="Project Name"
              placeholder="Enter project name"
            />

            <FormErrorMessage message={errors.root?.message} />
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              className="w-full"
              type="submit"
              isLoading={isSubmitting}
            >
              Create Project
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
});
