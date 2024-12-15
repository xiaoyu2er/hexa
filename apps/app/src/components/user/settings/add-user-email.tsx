import { Form } from '@/components/form';
import { InputField } from '@/components/form';
import {
  $addUserEmailSendPasscode,
  type InferApiResponseType,
} from '@/lib/api';
import { EmailSchema, type EmailType } from '@/server/schema/common';
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
import { Button } from '@nextui-org/react';
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
    formState: { isSubmitting, isDirty },
  } = form;

  const { mutateAsync: addUserEmail } = useMutation({
    mutationFn: $addUserEmailSendPasscode,
    onError: (err) => {
      setError('email', { message: err.message });
    },
    onSuccess: (data) => {
      toast.success('You just aded a new email!');
      onSuccess?.(data);
    },
  });

  return (
    <Form
      form={form}
      onSubmit={handleSubmit((json) => addUserEmail({ json }))}
      className="grid gap-4"
    >
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
        <CardFooter className="flex-row-reverse items-center gap-4 border-t px-6 py-4">
          <Button type="submit" color="primary" isLoading={isSubmitting}>
            Update
          </Button>
          <Button variant="light" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};
