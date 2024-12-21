'use client';
import { Form, PasswordField, setFormError } from '@/components/form';
import { FormErrorMessage } from '@/components/form';
import { useUser } from '@/hooks/use-user';
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { $updateUserPassword } from '@hexa/server/api';
import { EditPasswordSchema } from '@hexa/server/schema/reset-password';
import type { EditPasswordType } from '@hexa/server/schema/reset-password';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Link } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function EditPassword() {
  const { user, refetch } = useUser();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const form = useForm<EditPasswordType>({
    resolver: zodResolver(EditPasswordSchema),
    defaultValues: {},
  });
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    reset,
  } = form;

  const cancelUpdate = () => {
    reset();
    setShowResetPassword(false);
  };

  const { mutateAsync: updatePassword } = useMutation({
    mutationFn: $updateUserPassword,
    onSuccess: () => {
      toast.success('Password updated');
      refetch();
      reset();
      setShowResetPassword(false);
    },
    onError: (error) => {
      setFormError(error, setError);
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        {user.hasPassword ? (
          <CardDescription>
            Strengthen your account by ensuring your password is strong.
          </CardDescription>
        ) : (
          <CardDescription>
            Set a password to have an alternative way to log into your&nbsp;
            {NEXT_PUBLIC_APP_NAME} account.
          </CardDescription>
        )}
      </CardHeader>

      {showResetPassword ? (
        <Form
          form={form}
          onSubmit={handleSubmit((json) => updatePassword({ json }))}
        >
          <CardContent className="flex max-w-md flex-col gap-2">
            {user.hasPassword && (
              <PasswordField
                form={form}
                name="oldPassword"
                label="Old Password"
                placeholder="********"
              />
            )}
            <PasswordField
              form={form}
              name="password"
              placeholder="********"
              label={user.hasPassword ? 'New Password' : 'Password'}
            />
            <PasswordField
              form={form}
              name="confirmPassword"
              placeholder="********"
              label="Confirm Password"
            />
            <FormErrorMessage message={errors.root?.message} />
            <Link
              size="sm"
              className="p-0"
              href="/reset-password"
              color="primary"
              underline="always"
            >
              Forget password?
            </Link>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="shrink-0"
              isLoading={isSubmitting}
              color="primary"
            >
              {user.hasPassword ? 'Update' : 'Set'} password
            </Button>
            <Button variant="light" className="shrink-0" onPress={cancelUpdate}>
              Cancel
            </Button>
          </CardFooter>
        </Form>
      ) : (
        <>
          <CardContent>
            {user.hasPassword && (
              <Input placeholder="********" className="max-w-md" isDisabled />
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="shrink-0"
              color="primary"
              onPress={() => setShowResetPassword(true)}
            >
              {user.hasPassword ? 'Update' : 'Set'} password
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
