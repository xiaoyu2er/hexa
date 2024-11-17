'use client';

import { Input } from '@hexa/ui/input';

import { setFormError } from '@/lib/form';
import { invalidateUser } from '@/lib/queries/user';
import { $updateUsername } from '@/server/client';
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

import {
  ChangeUserNameSchema,
  type ChangeUserNameType,
} from '@/features/user/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { ExclamationTriangleIcon } from '@hexa/ui/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';

export const ChangeUsernameModal = NiceModal.create(() => {
  const modal = useModal();
  const understandBool = useBoolean();

  const form = useForm<ChangeUserNameType>({
    resolver: zodResolver(ChangeUserNameSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: changeUsername } = useMutation({
    mutationFn: $updateUsername,
    onError: (err) => {
      setFormError(err, setError, 'name');
      modal.reject(err);
    },
    onSuccess: () => {
      toast.success('Your username has been changed.');
      modal.resolve();
      modal.remove();
      invalidateUser();
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
            <DialogTitle>Enter a new username</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) => changeUsername({ json }))}
              method="POST"
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogBody>
              <DialogFooter>
                <Button className="w-full" type="submit" loading={isSubmitting}>
                  Change username
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent className="md:max-w-[485px]">
          <DialogHeader>
            <DialogTitle>Really change your username?</DialogTitle>
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
                workspaces.
              </li>
              <li>Your old username will be available for anyone to claim.</li>
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
              I understand, let’s change my username
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
});
