import { Form, setFormError } from '@/components/form';
import { InputField } from '@/components/form';
import {
  $addUserEmailSendPasscode,
  type InferApiResponseType,
} from '@hexa/server/api';
import { EmailSchema, type EmailType } from '@hexa/server/schema/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import { Button } from '@heroui/react';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

interface AddUserEmailProps {
  onSuccess?: (
    data: InferApiResponseType<typeof $addUserEmailSendPasscode>
  ) => void;
  onCancel?: () => void;
}
export const AddUserEmail: FC<AddUserEmailProps> = ({
  onSuccess,
  onCancel,
}) => {
  const form = useForm<EmailType>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: addUserEmail } = useMutation({
    mutationFn: $addUserEmailSendPasscode,
    onError: (err) => {
      setFormError(err, setError, 'email', true);
    },
    onSuccess: (data) => {
      toast.success('You just aded a new email!');
      onSuccess?.(data);
    },
  });

  return (
    <Form form={form} onSubmit={handleSubmit((json) => addUserEmail({ json }))}>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add email address</CardTitle>
          <CardDescription>
            An email containing a verification code will be sent to this email
            address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputField form={form} name="email" label="Email" />
        </CardContent>
        <CardFooter>
          <Button type="submit" color="primary" isLoading={isSubmitting}>
            Update
          </Button>
          <Button variant="light" onPress={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};
