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
  FormMessage,
} from "@hexa/ui/form";
import { Input } from "@hexa/ui/input";

import {
  invalidateWorkspaceBySlugQuery,
  invalidateWorkspacesQuery,
  queryWorkspaceBySlugOptions,
} from "@/lib/queries/workspace";
import {
  type UpdateWorkspaceNameInput,
  UpdateWorkspacerNameSchema,
} from "@/lib/zod/schemas/workspace";
import { $updateWorkspaceName } from "@/server/client";
import { NEXT_PUBLIC_APP_NAME } from "@hexa/env";
import { Button } from "@hexa/ui/button";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export function EditWorkspaceName({ slug }: { slug: string }) {
  const { data: ws } = useSuspenseQuery(queryWorkspaceBySlugOptions(slug));
  const form = useForm<UpdateWorkspaceNameInput>({
    resolver: zodResolver(UpdateWorkspacerNameSchema),
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
  }, [reset, ws]);

  const { mutateAsync: updateWorkspaceName } = useMutation({
    mutationFn: $updateWorkspaceName,
    onError: (err) => {
      setError("name", { message: err.message });
    },
    onSuccess: () => {
      toast.success("The workspace name has been updated");
      reset();
      invalidateWorkspaceBySlugQuery(slug);
      invalidateWorkspacesQuery();
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((json) =>
          updateWorkspaceName({
            json,
            param: { workspaceId: ws.id },
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
              {NEXT_PUBLIC_APP_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between">
            <Button
              type="submit"
              className="shrink-0"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
