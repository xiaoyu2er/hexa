'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import { InputField } from '@/components/form/input-field';
import { $deleteOrg } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { setFormError } from '@/lib/form';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import {
  DELETE_ORG_CONFIRMATION,
  DeleteOrgSchema,
  type DeleteOrgType,
} from '@/server/schema/org';
import {} from '@/server/schema/project';
import { Button } from '@hexa/ui/button';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import {
  Dialog,
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
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function DeleteOrg() {
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
      toast.success('Account deleted successfully');
      invalidateProjectsQuery();
      router.replace('/');
    },
  });

  return (
    <Card className="border border-red-600">
      <CardHeader>
        <CardTitle>Delete organization</CardTitle>
        <CardDescription>
          Permanently delete your {NEXT_PUBLIC_APP_NAME} organization, and it's
          respective stats. This action cannot be undone - please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-row-reverse items-center justify-between border-red-600 border-t px-6 py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="submit" variant="destructive" className="shrink-0">
              Delete organization
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form
                onSubmit={handleSubmit((json) =>
                  deleteOrg({
                    json,
                  })
                )}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Delete Organization</DialogTitle>
                  <DialogDescription>
                    Permanently delete your {NEXT_PUBLIC_APP_NAME} organization,
                    and it's respective stats. This action cannot be undone -
                    please proceed with caution.
                  </DialogDescription>
                </DialogHeader>

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

                <DialogFooter>
                  <Button
                    variant="destructive"
                    className="w-full"
                    type="submit"
                    loading={isSubmitting}
                  >
                    {DELETE_ORG_CONFIRMATION}
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
