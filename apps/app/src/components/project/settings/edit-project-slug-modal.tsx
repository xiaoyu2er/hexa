'use client';

import { Dialog } from '@/components/dialog';
import { setFormError } from '@/components/form';
import { Form } from '@/components/form';
import { InputField } from '@/components/form/input-field';
import { $updateProjectSlug } from '@/lib/api';
import {
  UpdateProjectSlugSchema,
  type UpdateProjectSlugType,
} from '@/server/schema/project';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button } from '@nextui-org/react';
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
      <Dialog control={modal}>
        {understandBool.value ? (
          <DialogContent className="md:max-w-[485px]">
            <DialogHeader>
              <DialogTitle>Enter a new project slug</DialogTitle>
            </DialogHeader>

            <Form
              form={form}
              onSubmit={handleSubmit((json) => updateProjectSlug({ json }))}
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
                <InputField form={form} name="slug" label="Slug" />
              </DialogBody>
              <DialogFooter>
                <Button
                  className="w-full"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Change slug
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        ) : (
          <DialogContent className="md:max-w-[485px]">
            <DialogHeader>
              <DialogTitle>Really change project slug?</DialogTitle>
            </DialogHeader>
            <DialogBody>
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
                <li>Project old slug will be available for anyone to claim.</li>
                <li>You will need to update any bookmarks or saved links.</li>
              </ul>
            </DialogBody>
            <DialogFooter>
              <Button
                color="danger"
                className="w-full"
                type="submit"
                onClick={understandBool.setTrue}
              >
                I understand, let’s change project slug
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    );
  }
);
