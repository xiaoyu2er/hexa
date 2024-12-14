'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import { setFormError } from '@/components/form';
import { Form } from '@/components/form';
import { $deleteUser } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import {
  DELETE_USER_CONFIRMATION,
  DeleteUserSchema,
  type DeleteUserType,
} from '@/server/schema/user';

import { InputField } from '@/components/form/input-field';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@hexa/ui/responsive-dialog';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function DeleteAccount() {
  const form = useForm<DeleteUserType>({
    resolver: zodResolver(DeleteUserSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: $deleteUser,
    onError: (err) => {
      setFormError(err, setError, 'confirm');
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
    },
  });

  return (
    <Card className="border border-danger-500">
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>
          Permanently delete your {NEXT_PUBLIC_APP_NAME} account, and their
          respective stats. This action cannot be undone - please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-row-reverse items-center justify-between border-danger-500 border-t px-6 py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button color="danger" className="shrink-0">
              Delete account
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete account</DialogTitle>
              <DialogDescription>
                Warning: Permanently delete your&nsbp;
                {NEXT_PUBLIC_APP_NAME}&nbsp;account, and their respective stats.
                This action cannot be undone - please proceed with caution.
              </DialogDescription>
            </DialogHeader>
            <Form
              form={form}
              onSubmit={handleSubmit((json) => deleteUser({ json }))}
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
                <InputField
                  form={form}
                  name="confirm"
                  label={
                    <>
                      To verify, type
                      <span className="px-1 font-bold">
                        {DELETE_USER_CONFIRMATION}
                      </span>
                      below
                    </>
                  }
                />
              </DialogBody>
              <DialogFooter>
                <Button
                  color="danger"
                  className="w-full"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {DELETE_USER_CONFIRMATION}
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
