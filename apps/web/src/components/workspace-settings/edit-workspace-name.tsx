"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { Input } from "@hexa/ui/input";
import { LoadingButton } from "@hexa/ui/loading-button";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { updateWorkspaceNameAction } from "@/lib/actions/workspace";
import {
  UpdateWorkspaceNameInput,
  UpdateWorkspacerNameSchema,
} from "@/lib/zod/schemas/workspace";
import { queryWorkspaceBySlugOptions } from "@/lib/queries/workspace";
import { useSuspenseQuery } from "@tanstack/react-query";

export function EditWorkspaceName({ slug }: { slug: string }) {
  const { data: ws } = useSuspenseQuery(queryWorkspaceBySlugOptions(slug));
  const form = useForm<Pick<UpdateWorkspaceNameInput, "name">>({
    resolver: zodResolver(UpdateWorkspacerNameSchema.pick({ name: true })),
    defaultValues: useMemo(() => {
      return {
        name: ws?.name ?? "",
      };
    }, [ws]),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: ws?.name ?? "",
    });
  }, [ws]);

  const { execute } = useServerAction(updateWorkspaceNameAction, {
    onError: ({ err }) => {
      setError("name", { message: err.message });
    },
    onSuccess: () => {
      toast.success("The workspace name has been updated");
      reset();
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) =>
          execute({
            ...form,
            workspaceId: ws.id,
          }),
        )}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Workspace Name</CardTitle>
            <CardDescription>
              This will be the workspace's display name on{" "}
              {process.env.NEXT_PUBLIC_APP_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between">
            <LoadingButton
              type="submit"
              className="shrink-0"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Update
            </LoadingButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
