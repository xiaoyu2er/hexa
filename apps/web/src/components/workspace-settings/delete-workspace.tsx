"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { Input } from "@hexa/ui/input";
import { LoadingButton } from "@hexa/ui/loading-button";
import { useServerAction } from "zsa-react";
import { toast } from "@hexa/ui/sonner";
import { Button } from "@hexa/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@hexa/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { useForm } from "react-hook-form";
import { DeleteUserInput } from "@/lib/zod/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceModel } from "@/lib/db";
import {
  DELETE_WORKSPACE_CONFIRMATION,
  DeleteWorkspaceInput,
  DeleteWorkspaceSchema,
} from "@/lib/zod/schemas/workspace";
import { deleteWorkspaceAction } from "@/lib/actions/workspace";
import { useRouter } from "next/navigation";
import { invalidateWorkspacesQuery, queryWorkspaceBySlugOptions } from "@/lib/queries/workspace";
import { useSuspenseQuery } from "@tanstack/react-query";

export function DeleteWorkspace({ slug }: { slug: string }) {
  const { data: ws } = useSuspenseQuery(queryWorkspaceBySlugOptions(slug));
  const router = useRouter();
  const form = useForm<DeleteWorkspaceInput>({
    resolver: zodResolver(DeleteWorkspaceSchema),
    defaultValues: {
      confirm: "",
      workspaceId: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { execute } = useServerAction(deleteWorkspaceAction, {
    onError: ({ err }) => {
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof DeleteUserInput, {
              message: message[0],
            });
          }
        });
        if (err.formErrors?.length) {
          setError("confirm", { message: err.formErrors[0] });
        }
      } else {
        setError("confirm", { message: err.message });
      }
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
      invalidateWorkspacesQuery();
      router.replace("/workspaces");
    },
  });

  return (
    <Card className="border border-red-600">
      <CardHeader>
        <CardTitle>Delete Workspace</CardTitle>
        <CardDescription>
          Permanently delete your {process.env.NEXT_PUBLIC_APP_NAME} workspace,
          and it's respective stats. This action cannot be undone - please
          proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t  border-red-600 px-6 py-4 items-center flex-row-reverse justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="submit" variant="destructive" className="shrink-0">
              Delete Workspace
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form
                onSubmit={handleSubmit((form) => execute(form))}
                method="POST"
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Delete Workspace</DialogTitle>
                  <DialogDescription>
                    Permanently delete your {process.env.NEXT_PUBLIC_APP_NAME}{" "}
                    workspace, and it's respective stats. This action cannot be
                    undone - please proceed with caution.
                  </DialogDescription>
                </DialogHeader>

                <FormField
                  control={form.control}
                  name="workspaceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>You workspace Id</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={errors.confirm ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        To verify, type{" "}
                        <span className="font-bold">
                          {DELETE_WORKSPACE_CONFIRMATION}
                        </span>{" "}
                        below
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={errors.confirm ? "border-destructive" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <LoadingButton
                    variant="destructive"
                    className="w-full"
                    type="submit"
                    loading={isSubmitting}
                  >
                    {DELETE_WORKSPACE_CONFIRMATION}
                  </LoadingButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
