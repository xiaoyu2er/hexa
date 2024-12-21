'use client';
import { Form } from '@/components/form';
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import {
  UpdateAvatarSchema,
  type UpdateAvatarType,
} from '@hexa/server/schema/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { FileUpload } from '@hexa/ui/file-upload';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
    formState: { isSubmitting },
  } = form;

  const { mutateAsync: updateAvatar } = useMutation({
    mutationFn: onUpdate,

    onError: (err) => {
      toast.error(err.message);
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
    <Form form={form} onSubmit={handleSubmit((form) => updateAvatar(form))}>
      <Card>
        <CardHeader>
          <CardTitle>{title ?? 'Avatar'}</CardTitle>
          <CardDescription>
            {description ??
              `This avatar will be used on ${NEXT_PUBLIC_APP_NAME}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            control={form.control}
            name="image"
            render={({ field: { onChange } }) => (
              <>
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
              </>
            )}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            type="submit"
            color="primary"
            className="mr-2 shrink-0"
            isLoading={isSubmitting}
            isDisabled={avatarUrl === avatarUrlProp}
          >
            Update
          </Button>

          <p className="text-gray-500 text-sm">
            Accepted file types: .png, .jpg. Max file size: 2MB.
          </p>
        </CardFooter>
      </Card>
    </Form>
  );
}
