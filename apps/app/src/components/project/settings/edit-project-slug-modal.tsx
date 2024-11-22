'use client';

import { $updateProjectSlug } from '@/lib/api';
import { setFormError } from '@/lib/form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Alert, AlertDescription, AlertTitle } from '@hexa/ui/alert';
import { Button } from '@hexa/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import { toast } from '@hexa/ui/sonner';

import { SlugField } from '@/components/form/slug-field';
import {
  UpdateProjectSlugSchema,
  type UpdateProjectSlugType,
} from '@/features/project/schema';
import type { SelectProjectType } from '@/features/project/schema';
import { Form } from '@hexa/ui/form';
import { ExclamationTriangleIcon } from '@hexa/ui/icons';
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
      <Dialog
        open={modal.visible}
        onOpenChange={(v: boolean) => {
          if (!v) {
            modal.resolveHide();
          }
          !v && !modal.keepMounted && modal.remove();
        }}
      >
        {understandBool.value ? (
          <DialogContent className="md:max-w-[485px]">
            <DialogHeader>
              <DialogTitle>Enter a new project slug</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={handleSubmit((json) => updateProjectSlug({ json }))}
                method="PUT"
                className="md:space-y-4"
              >
                <DialogBody className="space-y-2">
                  <SlugField form={form} />
                </DialogBody>
                <DialogFooter>
                  <Button
                    className="w-full"
                    type="submit"
                    loading={isSubmitting}
                  >
                    Change slug
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        ) : (
          <DialogContent className="md:max-w-[485px]">
            <DialogHeader>
              <DialogTitle>Really change project slug?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Alert variant="destructive" className="mt-2">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>
                  Unexpected bad things will happen if you don’t read this!
                </AlertDescription>
              </Alert>
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
                variant="destructive"
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
