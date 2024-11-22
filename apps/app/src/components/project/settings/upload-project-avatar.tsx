'use client';

import { getProjectAvatarFallbackUrl } from '@/lib/project';
import { FileUpload } from '@hexa/ui/file-upload';
import { toast } from '@hexa/ui/sonner';
import { useEffect, useState } from 'react';

import { useProject } from '@/components/providers/project-provicer';
import { useSession } from '@/components/providers/session-provider';
import { $updateProjectAvatar } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import {} from '@/lib/queries/workspace';
import {
  UpdateProjectAvatarSchema,
  type UpdateProjectAvatarType,
} from '@/server/schema/project';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@hexa/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function UploadProjectAvatar() {
  const { project, invalidate } = useProject();
  const { user } = useSession();

  const form = useForm<UpdateProjectAvatarType>({
    resolver: zodResolver(UpdateProjectAvatarSchema),
    defaultValues: {
      projectId: project.id,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync: updateProjectAvatar } = useMutation({
    mutationFn: $updateProjectAvatar,
    onError: (err) => {
      setError('image', { message: err.message });
    },
    onSuccess: () => {
      toast.success("Successfully updated the workspace's avatar image!");
      invalidate();
    },
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    project.avatarUrl
  );

  useEffect(() => {
    setAvatarUrl(project.avatarUrl ?? getProjectAvatarFallbackUrl(project));
  }, [project]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => {
          return updateProjectAvatar({
            form,
          });
        })}
        className="grid gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Project avatar</CardTitle>
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
          <CardFooter className="flex-row-reverse items-center justify-between border-t px-6 py-4">
            <Button
              className="mr-2 shrink-0"
              loading={isSubmitting}
              disabled={avatarUrl === user.avatarUrl}
            >
              Update
            </Button>

            <p className="text-gray-500 text-sm">
              Accepted file types: .png, .jpg. Max file size: 2MB.
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
