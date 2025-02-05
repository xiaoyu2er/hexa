'use client';
import { Form, setFormError } from '@/components/form';
import { FormErrorMessage } from '@/components/form';
import { InputField } from '@/components/form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { $createTag } from '@hexa/server/api';
import {} from '@hexa/server/schema/org-invite';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { InsertTagSchema, type InsertTagType } from '@hexa/server/schema/tag';
import { toast } from '@hexa/ui/sonner';
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

export const CreateTagModal = NiceModal.create((project: SelectProjectType) => {
  const modal = useModal();

  const form = useForm<InsertTagType>({
    resolver: zodResolver(InsertTagSchema),
    defaultValues: {
      projectId: project.id,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: createTag } = useMutation({
    mutationFn: $createTag,
    onError: (err) => {
      setFormError(err, setError);
      modal.reject(err);
    },
    onSuccess: () => {
      toast.success('Tag created successfully');
      modal.resolve();
      modal.remove();
    },
  });

  return (
    <Modal isOpen={modal.visible} onOpenChange={() => modal.hide()} size="md">
      <ModalContent>
        <ModalHeader>Create tag</ModalHeader>
        <Form
          form={form}
          onSubmit={handleSubmit((json) => createTag({ json }))}
        >
          <ModalBody className="space-y-2">
            <InputField
              form={form}
              name="name"
              size="md"
              placeholder="Enter a tag name"
              hideErrorMessageCodes={['invalid_string']}
            />
            <FormErrorMessage message={errors.root?.message} />
          </ModalBody>
          <ModalFooter>
            <Button
              className="w-full"
              color="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Create tag
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
});
