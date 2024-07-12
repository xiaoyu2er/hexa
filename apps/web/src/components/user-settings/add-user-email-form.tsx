import { addUserEmailAction } from "@/lib/actions/user";
import { OnlyEmailInput, OnlyEmailSchema } from "@/lib/zod/schemas/auth";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@hexa/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "@hexa/ui/form";
import { Input } from "@hexa/ui/input";
import { Label } from "@hexa/ui/label";

import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export function AddUserEmailForm({
  onSuccess,
  onCancel,
}: {
  onSuccess?: (data: { email: string }) => void;
  onCancel?: () => void;
}) {
  const form = useForm<OnlyEmailInput>({
    resolver: zodResolver(OnlyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
  } = form;

  const { execute: execAddUserEmail } = useServerAction(addUserEmailAction, {
    onError: ({ err }) => {
      setError("email", { message: err.message });
    },
    onSuccess: ({ data }) => {
      toast.success("You just aded a new email!");
      onSuccess?.(data);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => execAddUserEmail(form))}
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
          <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse gap-4">
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
}
