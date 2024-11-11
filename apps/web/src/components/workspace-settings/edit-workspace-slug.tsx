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

import { NEXT_PUBLIC_APP_NAME } from "@/lib/env";
import {
  invalidateWorkspacesQuery,
  queryWorkspaceBySlugOptions,
} from "@/lib/queries/workspace";
import {
  type UpdateWorkspaceSlugInput,
  UpdateWorkspaceSlugSchema,
} from "@/lib/zod/schemas/workspace";
import { $updateWorkspaceSlug } from "@/server/client";
import { Button } from "@hexa/ui/button";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function EditWorkspaceSlug({ slug }: { slug: string }) {
  const { data: ws } = useSuspenseQuery(queryWorkspaceBySlugOptions(slug));
  const router = useRouter();
  const form = useForm<UpdateWorkspaceSlugInput>({
    resolver: zodResolver(UpdateWorkspaceSlugSchema),
    defaultValues: {
      slug: ws.slug,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
  } = form;

  const { mutateAsync: updateWorkspaceSlug } = useMutation({
    mutationFn: $updateWorkspaceSlug,
    onError: (err) => {
      setError("slug", { message: err.message });
    },
    onSuccess: (workspace) => {
      const slug = workspace.slug;
      toast.success("The workspace slug has been updated");
      invalidateWorkspacesQuery();
      router.replace(`/${slug}/settings`);
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) =>
          updateWorkspaceSlug({
            json: {
              slug: form.slug,
            },
            param: { workspaceId: ws.id },
          }),
        )}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Workspace Slug</CardTitle>
            <CardDescription>
              This will be the workspace's slug name on {NEXT_PUBLIC_APP_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="slug"
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
