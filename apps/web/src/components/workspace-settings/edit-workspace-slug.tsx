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
import { updateWorkspaceSlugAction } from "@/lib/actions/workspace";
import { WorkspaceModel } from "@/lib/db/schema";
import {
  UpdateWorkspaceSlugInput,
  UpdateWorkspaceSlugSchema,
} from "@/lib/zod/schemas/workspace";
import { useRouter } from "next/navigation";

export function EditWorkspaceSlug({ ws }: { ws: WorkspaceModel }) {
  const router = useRouter();
  const form = useForm<Omit<UpdateWorkspaceSlugInput, "workspaceId">>({
    resolver: zodResolver(
      UpdateWorkspaceSlugSchema.omit({ workspaceId: true })
    ),
    defaultValues: useMemo(() => {
      return {
        slug: ws.slug ?? "",
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
      slug: ws?.slug ?? "",
    });
  }, [ws]);

  const { execute } = useServerAction(updateWorkspaceSlugAction, {
    onError: ({ err }) => {
      setError("slug", { message: err.message });
    },
    onSuccess: ({ data }) => {
      const slug = data.workspace?.slug;
      toast.success("The workspace slug has been updated");
      reset();
      router.replace(`/${slug}/settings`);
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) =>
          execute({
            ...form,
            workspaceId: ws.id,
          })
        )}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Workspace Slug</CardTitle>
            <CardDescription>
              This will be the workspace's slug name on{" "}
              {process.env.NEXT_PUBLIC_APP_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
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
