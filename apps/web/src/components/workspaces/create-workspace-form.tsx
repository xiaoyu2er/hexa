"use client";

import { Input } from "@hexa/ui/input";

import { createWorkspaceAction } from "@/lib/actions/workspace";
import { setFormError } from "@/lib/form";
import { invalidateWorkspacesQuery } from "@/lib/queries/workspace";
import {
  type CreateWorkspaceInput,
  CreateWorkspaceSchema,
} from "@/lib/zod/schemas/workspace";
import { Button } from "@hexa/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@hexa/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export interface CreateWorkspaceFormProps {
  onSuccess?: () => void;
}

export function CreateWorkspaceForm({ onSuccess }: CreateWorkspaceFormProps) {
  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { execute } = useServerAction(createWorkspaceAction, {
    onError: ({ err }) => {
      setFormError(err, setError);
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      onSuccess?.();
      invalidateWorkspacesQuery();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => execute(form))}
        method="POST"
        className="space-y-4"
      >
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>Create a new workspace</DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={errors.name ? "border-destructive" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={errors.slug ? "border-destructive" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrorMessage message={errors.root?.message} />

        <DialogFooter>
          <Button className="w-full" type="submit" loading={isSubmitting}>
            Create Workspace
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
