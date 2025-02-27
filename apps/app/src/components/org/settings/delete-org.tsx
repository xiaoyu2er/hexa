'use client';

import {
  Form,
  FormErrorMessage,
  InputField,
  setFormError,
} from '@/components/form';
import { invalidateProjectsQuery } from '@/lib/queries/project';
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
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { $deleteOrg } from '@hexa/server/api';
import {
  DELETE_ORG_CONFIRMATION,
  DeleteOrgSchema,
  type DeleteOrgType,
} from '@hexa/server/schema/org';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function DeleteOrg() {
  const modal = useModal(DeleteOrgModal);

  return (
    <Card className="border border-red-500">
      <CardHeader>
        <CardTitle>Delete organization</CardTitle>
        <CardDescription>
          Permanently delete your {NEXT_PUBLIC_APP_NAME} organization, and it's
          respective stats. This action cannot be undone - please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className=" border-red-500">
        <Button
          type="submit"
          color="danger"
          className="shrink-0"
          onPress={() => modal.show()}
        >
          Delete organization
        </Button>
      </CardFooter>
    </Card>
  );
}

export const DeleteOrgModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();

  const form = useForm<DeleteOrgType>({
    resolver: zodResolver(DeleteOrgSchema),
    defaultValues: {},
  });
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: deleteOrg } = useMutation({
    mutationFn: $deleteOrg,
    onError: (err) => {
      setFormError(err, setError);
    },
    onSuccess: () => {
      toast.success('Organization deleted successfully');
      modal.resolve();
      invalidateProjectsQuery();
      router.replace('/');
    },
  });
  return (
    <Modal isOpen={modal.visible} onOpenChange={modal.remove} backdrop="blur">
      <ModalContent>
        <Form
          form={form}
          onSubmit={handleSubmit((json) =>
            deleteOrg({
              json,
            })
          )}
        >
          <ModalHeader>Delete Organization</ModalHeader>
          <ModalBody>
            <Alert
              color="danger"
              description={`Permanently delete your ${NEXT_PUBLIC_APP_NAME} organization, and it's respective stats. This action cannot be undone - please proceed with caution.`}
            />
            <InputField form={form} name="orgId" label="Organization ID" />
            <InputField
              form={form}
              name="confirm"
              label={
                <>
                  To verify, type
                  <span className="px-1 font-bold">
                    {DELETE_ORG_CONFIRMATION}
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
              {DELETE_ORG_CONFIRMATION}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
});
