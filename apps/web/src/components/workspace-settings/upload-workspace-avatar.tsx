"use client";

import { FileUpload } from "@hexa/ui/file-upload";
import { useSession } from "@/providers/session-provider";
import { useEffect, useState } from "react";
import { toast } from "@hexa/ui/sonner";
import { getAvatarFallbackUrl } from "@/lib/workspace";
import { LoadingButton } from "@hexa/ui/loading-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@hexa/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@hexa/ui/form";
import {
  UpdateWorkspaceAvatarInput,
  UpdateWorkspaceAvatarSchema,
} from "@/lib/zod/schemas/workspace";
import { WorkspaceModel } from "@/lib/db/schema";
import { updateWorkspaceAvatarAction } from "@/lib/actions/workspace";

export function UploadWorkspaceAvatar({ ws }: { ws: WorkspaceModel }) {
  const { user } = useSession();

  const form = useForm<Omit<UpdateWorkspaceAvatarInput, "workspaceId">>({
    resolver: zodResolver(
      UpdateWorkspaceAvatarSchema.omit({ workspaceId: true })
    ),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
    reset,
  } = form;

  const { execute } = useServerAction(updateWorkspaceAvatarAction, {
    onError: ({ err }) => {
      setError("image", { message: err.message });
    },
    onSuccess: () => {
      toast.success("Successfully updated the workspace's avatar image!");
      reset();
    },
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    ws.avatarUrl
  );

  useEffect(() => {
    console.log("ws updated", ws);
    setAvatarUrl(ws.avatarUrl ?? getAvatarFallbackUrl(ws));
  }, [ws]);

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
            <CardTitle>Workspace Avatar</CardTitle>
            <CardDescription>
              This is workspace's avatar image on{" "}
              {process.env.NEXT_PUBLIC_APP_NAME}.
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
            <LoadingButton
              className="shrink-0 mr-2"
              loading={isSubmitting}
              disabled={avatarUrl === user?.avatarUrl}
            >
              Update
            </LoadingButton>

            <p className="text-sm text-gray-500">
              Accepted file types: .png, .jpg. Max file size: 2MB.
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
