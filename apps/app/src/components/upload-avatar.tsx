'use client';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
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

export default function UploadAvatar({
  onUpdate,
  avatarUrl: avatarUrlProp,
  title,
  description,
}: {
  onUpdate: (form: UpdateAvatarType) => Promise<unknown>;
  avatarUrl: string;
  title?: string;
  description?: string;
}) {
  const form = useForm<UpdateAvatarType>({
    resolver: zodResolver(UpdateAvatarSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync: updateAvatar } = useMutation({
    mutationFn: onUpdate,
    onError: (err) => {
      setError('image', { message: err.message });
    },
    onSuccess: () => {
      toast.success('Successfully updated avatar!');
    },
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    avatarUrlProp
  );

  useEffect(() => {
    setAvatarUrl(avatarUrlProp);
  }, [avatarUrlProp]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => updateAvatar(form))}
        method="POST"
        className="grid gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>{title ?? 'Avatar'}</CardTitle>
            <CardDescription>
              {description ??
                `This avatar will be used on ${NEXT_PUBLIC_APP_NAME}.`}
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
              disabled={avatarUrl === avatarUrlProp}
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
