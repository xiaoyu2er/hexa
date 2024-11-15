'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Input } from '@hexa/ui/input';

import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { setFormError } from '@/lib/form';
import {
  DELETE_USER_CONFIRMATION,
  type DeleteUserInput,
  DeleteUserSchema,
} from '@/lib/zod/schemas/user';
import { $deleteUser } from '@/server/client';
import { Button } from '@hexa/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';

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
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function DeleteAccount() {
  const form = useForm<DeleteUserInput>({
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
    <Card className="border border-red-600">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your {NEXT_PUBLIC_APP_NAME} account, and their
          respective stats. This action cannot be undone - please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-row-reverse items-center justify-between border-red-600 border-t px-6 py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="submit" variant="destructive" className="shrink-0">
              Delete Account
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Warning: Permanently delete your
                {NEXT_PUBLIC_APP_NAME} account, and their respective stats. This
                action cannot be undone - please proceed with caution.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(() => deleteUser({}))}
                method="POST"
                className="md:space-y-4"
              >
                <DialogBody className="space-y-2">
                  <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          To verify, type&nbsp;
                          <span className="font-bold">
                            {DELETE_USER_CONFIRMATION}
                          </span>
                          &nbsp;below
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={
                              errors.confirm ? 'border-destructive' : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </DialogBody>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    className="w-full"
                    type="submit"
                    loading={isSubmitting}
                  >
                    {DELETE_USER_CONFIRMATION}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
