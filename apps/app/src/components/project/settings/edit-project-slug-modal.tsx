'use client';
import { setFormError } from '@/components/form';
import { Form } from '@/components/form';
import { InputField } from '@/components/form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { $updateProjectSlug } from '@hexa/server/api';
import {
  UpdateProjectSlugSchema,
  type UpdateProjectSlugType,
} from '@hexa/server/schema/project';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';

export const EditProjectSlugModal = NiceModal.create(
  ({ project }: { project: SelectProjectType }) => {
    const modal = useModal();
    const understandBool = useBoolean();

    const form = useForm<UpdateProjectSlugType>({
      resolver: zodResolver(UpdateProjectSlugSchema),
      defaultValues: {
        projectId: project.id,
      },
    });

    const {
      handleSubmit,
      setError,
      formState: { isSubmitting },
    } = form;

    const { mutateAsync: updateProjectSlug } = useMutation({
      mutationFn: $updateProjectSlug,
      onError: (err) => {
        setFormError(err, setError, 'slug', true);
        modal.reject(err);
      },
      onSuccess: (newProject) => {
        toast.success('Project slug has been changed.');
        modal.resolve(newProject);
        modal.remove();
      },
    });

    return (
      <Modal isOpen={modal.visible} onOpenChange={modal.remove} backdrop="blur">
        {understandBool.value ? (
          <ModalContent>
            <ModalHeader>Enter a new project slug</ModalHeader>
            <Form
              form={form}
              onSubmit={handleSubmit((json) => updateProjectSlug({ json }))}
            >
              <ModalBody className="space-y-2">
                <InputField form={form} name="slug" label="New project slug" />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="w-full"
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Change slug
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        ) : (
          <ModalContent className="md:max-w-[485px]">
            <ModalHeader>Really change project slug?</ModalHeader>

            <ModalBody>
              <Alert
                color="danger"
                className="mt-2"
                title="Notice"
                description="Unexpected bad things will happen if you don’t read this!"
              />
              <ul className="list-disc px-3 pt-3">
                <li>
                  We <strong>will not</strong> set up redirects for your
                  projects.
                </li>
                <li>
                  Project's old slug will be available for new projects to
                  claim.
                </li>
                <li>You will need to update any bookmarks or saved links.</li>
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                className="w-full"
                type="submit"
                onClick={understandBool.setTrue}
              >
                I understand, let’s change project slug
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    );
  }
);
