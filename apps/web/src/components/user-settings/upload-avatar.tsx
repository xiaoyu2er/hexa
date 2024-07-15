"use client";

import { getAvatarFallbackUrl } from "@/lib/user";
import { FileUpload } from "@hexa/ui/file-upload";
import { toast } from "@hexa/ui/sonner";
import { useEffect, useState } from "react";

import { updateUserAvatarAction } from "@/lib/actions/user";
import { queryUserOptions } from "@/lib/queries/user";
import {
  type UpdateAvatarInput,
  UpdateAvatarSchema,
} from "@/lib/zod/schemas/user";
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
import { useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export default function UploadAvatar() {
  const { data: user, refetch } = useSuspenseQuery(queryUserOptions);

  const form = useForm<UpdateAvatarInput>({
    resolver: zodResolver(UpdateAvatarSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(updateUserAvatarAction, {
    onError: ({ err }) => {
      setError("image", { message: err.message });
    },
    onSuccess: () => {
      toast.success("Successfully updated your profile picture!");
      refetch();
    },
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    user?.avatarUrl,
  );

  useEffect(() => {
    setAvatarUrl(user?.avatarUrl ?? getAvatarFallbackUrl(user));
  }, [user]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => execute(form))}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>
              This is your avatar image on {process.env.NEXT_PUBLIC_APP_NAME}.
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
              disabled={avatarUrl === user?.avatarUrl}
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
