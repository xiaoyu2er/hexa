'use client';

import {
  Form,
  FormErrorMessage,
  InputField,
  setFormError,
} from '@/components/form';
import { $deleteProject } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import {
  DELETE_PROJECT_CONFIRMATION,
  DeleteProjectSchema,
  type DeleteProjectType,
} from '@/server/schema/project';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function DeleteProject() {
  const modal = useModal(DeleteProjectModal);
  return (
    <Card className="border border-danger-500">
      <CardHeader>
        <CardTitle>Delete project</CardTitle>
        <CardDescription>
          Permanently delete your {NEXT_PUBLIC_APP_NAME} project, and it's
          respective stats. This action cannot be undone - please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-danger-500 ">
        <Button
          type="submit"
          color="danger"
          className="shrink-0"
          onClick={() => modal.show()}
        >
          Delete project
        </Button>
      </CardFooter>
    </Card>
  );
}

export const DeleteProjectModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();
  const form = useForm<DeleteProjectType>({
    resolver: zodResolver(DeleteProjectSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: deleteProject } = useMutation({
    mutationFn: $deleteProject,
    onError: (err) => {
      setFormError(err, setError);
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      invalidateProjectsQuery();
      router.replace('/');
    },
  });
  return (
    <Modal isOpen={modal.visible} onOpenChange={modal.hide} backdrop="blur">
      <ModalContent>
        <Form
          form={form}
          onSubmit={handleSubmit((json) =>
            deleteProject({
              json,
            })
          )}
        >
          <ModalHeader>Delete Project</ModalHeader>
          <ModalBody>
            <Alert
              color="danger"
              description={`Permanently delete your ${NEXT_PUBLIC_APP_NAME} project, and it's respective stats. This action cannot be undone - please proceed with caution.`}
            />
            <InputField
              form={form}
              name="projectId"
              labelPlacement="inside"
              label="Project ID"
            />
            <InputField
              form={form}
              name="confirm"
              labelPlacement="inside"
              label={
                <>
                  To verify, type
                  <span className="px-1 font-bold">
                    {DELETE_PROJECT_CONFIRMATION}
                  </span>
                  below
                </>
              }
            />
            <FormErrorMessage message={errors.root?.message} />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              className="w-full"
              type="submit"
              isLoading={isSubmitting}
            >
              {DELETE_PROJECT_CONFIRMATION}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
});
