"use client";

import { useSession } from "@/app/session-provider";
import { updateUserNameAction } from "@/lib/actions/user";
import {
  UpdateUserNameInput,
  UpdateUserNameSchema,
} from "@/lib/zod/schemas/user";
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
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { Input } from "@hexa/ui/input";
import { LoadingButton } from "@hexa/ui/loading-button";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export function EditUserName() {
  const { user } = useSession();

  const form = useForm<UpdateUserNameInput>({
    resolver: zodResolver(UpdateUserNameSchema),
    defaultValues: useMemo(() => {
      return {
        name: user?.name ?? "",
      };
    }, [user?.name]),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: user?.name ?? "",
    });
  }, [user?.name]);

  const { execute } = useServerAction(updateUserNameAction, {
    onError: ({ err }) => {
      setError("name", { message: err.message });
    },
    onSuccess: () => {
      toast.success("Your name has been updated");
      reset();
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((form) => execute(form))}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Your Name</CardTitle>
            <CardDescription>
              This will be your display name on Hexa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Update
            </LoadingButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
