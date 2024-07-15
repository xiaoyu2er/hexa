"use client";

import { updateUserNameAction } from "@/lib/actions/user";
import {
  type UpdateUserNameInput,
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
  FormMessage,
} from "@hexa/ui/form";
import { Input } from "@hexa/ui/input";

import { queryUserOptions } from "@/lib/queries/user";
import { Button } from "@hexa/ui/button";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export function EditName() {
  const { data: user, refetch } = useSuspenseQuery(queryUserOptions);

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
  }, [reset, user?.name]);

  const { execute } = useServerAction(updateUserNameAction, {
    onError: ({ err }) => {
      setError("name", { message: err.message });
    },
    onSuccess: () => {
      toast.success("Your name has been updated");
      refetch();
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
            <CardTitle>Name</CardTitle>
            <CardDescription>
              Your name may appear around {process.env.NEXT_PUBLIC_APP_NAME}.
              You can remove it at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between">
            <Button
              type="submit"
              className="shrink-0"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
