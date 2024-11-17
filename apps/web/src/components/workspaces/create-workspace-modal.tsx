'use client';

import { Input } from '@hexa/ui/input';

import { setFormError } from '@/lib/form';
import { invalidateWorkspacesQuery } from '@/lib/queries/workspace';
import { $createWorkspace } from '@/server/client';
import { Button } from '@hexa/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { toast } from '@hexa/ui/sonner';

import { useSession } from '@/components/providers/session-provider';
import { queryOrgsOptions } from '@/lib/queries/orgs';
import { getWorkspaceSlug } from '@/lib/workspace';
import {
  InsertWorkspaceSchema,
  type InsertWorkspaceType,
} from '@/server/db/schema';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hexa/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export const CreateWorkspaceModal = NiceModal.create(() => {
  const modal = useModal();
  const { user } = useSession();
  const router = useRouter();
  const {
    data: { data: orgs } = { data: [], rowCount: 0 },
  } = useQuery(queryOrgsOptions);
  const form = useForm<InsertWorkspaceType>({
    resolver: zodResolver(InsertWorkspaceSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: createWorkspace } = useMutation({
    mutationFn: $createWorkspace,
    onError: (err) => {
      setFormError(err, setError);
      modal.reject(err);
    },
    onSuccess: ({ ws }) => {
      toast.success('Workspace created successfully');
      modal.resolve();
      modal.remove();
      invalidateWorkspacesQuery();
      router.push(`/${getWorkspaceSlug(ws)}`);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>Create a new workspace</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => createWorkspace({ json }))}
            method="POST"
            className="md:space-y-4"
          >
            <DialogBody className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === user.id) {
                              form.setValue('ownerType', 'USER');
                            } else {
                              form.setValue('ownerType', 'ORG');
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={user.id}>{user.name}</SelectItem>
                            {orgs?.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={errors.desc ? 'border-destructive' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormErrorMessage message={errors.root?.message} />
            </DialogBody>

            <DialogFooter>
              <Button className="w-full" type="submit" loading={isSubmitting}>
                Create Workspace
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
