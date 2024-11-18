import { EmailSchema, type EmailType } from '@/features/common/schema';
import { $addUserEmail, type InferApiResponseType } from '@/lib/api';
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
import { Input } from '@hexa/ui/input';
import { Label } from '@hexa/ui/label';

import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

interface AddUserEmailFormProps {
  onSuccess?: (data: InferApiResponseType<typeof $addUserEmail>) => void;
  onCancel?: () => void;
}
export const AddUserEmailForm: FC<AddUserEmailFormProps> = ({
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
    mutationFn: $addUserEmail,
    onError: (err) => {
      setError('email', { message: err.message });
    },
    onSuccess: (data) => {
      toast.success('You just aded a new email!');
      onSuccess?.(data);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((json) => addUserEmail({ json }))}
        method="POST"
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-row-reverse items-center gap-4 border-t px-6 py-4">
            <Button
              type="submit"
              className="shrink-0"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Update
            </Button>
            <Button className="shrink-0" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
