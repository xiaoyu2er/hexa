"use client";

import { getWorkspaceAvatarFallbackUrl } from "@/lib/workspace";
import { FileUpload } from "@hexa/ui/file-upload";
import { toast } from "@hexa/ui/sonner";
import { useEffect, useState } from "react";

import { NEXT_PUBLIC_APP_NAME } from "@/lib/env";
import { queryUserOptions } from "@/lib/queries/user";
import {
  invalidateWorkspaceBySlugQuery,
  invalidateWorkspacesQuery,
  queryWorkspaceBySlugOptions,
} from "@/lib/queries/workspace";
import {
  type UpdateWorkspaceAvatarInput,
  UpdateWorkspaceAvatarSchema,
} from "@/lib/zod/schemas/workspace";
import { $updateWorkspaceAvatar } from "@/server/client";
import { Button } from "@hexa/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function UploadWorkspaceAvatar({ slug }: { slug: string }) {
  const { data: ws } = useSuspenseQuery(queryWorkspaceBySlugOptions(slug));
  const { data: user } = useSuspenseQuery(queryUserOptions);

  const form = useForm<UpdateWorkspaceAvatarInput>({
    resolver: zodResolver(UpdateWorkspaceAvatarSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync: updateWorkspaceAvatar } = useMutation({
    mutationFn: $updateWorkspaceAvatar,
    onError: (err) => {
      setError("image", { message: err.message });
    },
    onSuccess: () => {
      toast.success("Successfully updated the workspace's avatar image!");
      invalidateWorkspaceBySlugQuery(slug);
      invalidateWorkspacesQuery();
    },
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    ws.avatarUrl,
  );

  useEffect(() => {
    console.log("ws updated", ws);
    setAvatarUrl(ws.avatarUrl ?? getWorkspaceAvatarFallbackUrl(ws));
  }, [ws]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => {
          return updateWorkspaceAvatar({
            form,
            param: {
              workspaceId: ws.id,
            },
          });
        })}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Workspace Avatar</CardTitle>
            <CardDescription>
              This is workspace's avatar image on {NEXT_PUBLIC_APP_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      accept="images"
                      className="h-24 w-24 rounded-full border border-gray-300"
                      iconClassName="w-5 h-5"
                      variant="plain"
                      imageSrc={avatarUrl}
                      readFile
                      onChange={({ src, file }) => {
                        console.log(file, src);
                        onChange(file);
                        setAvatarUrl(src);
                      }}
                      content={null}
                      maxFileSizeMB={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between">
            <Button
              className="shrink-0 mr-2"
              loading={isSubmitting}
              disabled={avatarUrl === user.avatarUrl}
            >
              Update
            </Button>

            <p className="text-sm text-gray-500">
              Accepted file types: .png, .jpg. Max file size: 2MB.
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
