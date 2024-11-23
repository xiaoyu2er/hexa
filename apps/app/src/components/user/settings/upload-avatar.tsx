'use client';

import { useUser } from '@/hooks/use-user';
import { $updateUserAvatar } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { getAvatarFallbackUrl } from '@/lib/user';
import {
  UpdateAvatarSchema,
  type UpdateAvatarType,
} from '@/server/schema/common';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { FileUpload } from '@hexa/ui/file-upload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@hexa/ui/form';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function UploadAvatar() {
  const { user, refetch } = useUser();

  const form = useForm<UpdateAvatarType>({
    resolver: zodResolver(UpdateAvatarSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync: updateUserAvatar } = useMutation({
    mutationFn: $updateUserAvatar,
    onError: (err) => {
      setError('image', { message: err.message });
    },
    onSuccess: () => {
      toast.success('Successfully updated your profile picture!');
      refetch();
    },
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    user?.avatarUrl
  );

  useEffect(() => {
    setAvatarUrl(user?.avatarUrl ?? getAvatarFallbackUrl(user));
  }, [user]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => updateUserAvatar({ form }))}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>
              This is your avatar image on {NEXT_PUBLIC_APP_NAME}.
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
              disabled={avatarUrl === user?.avatarUrl}
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
