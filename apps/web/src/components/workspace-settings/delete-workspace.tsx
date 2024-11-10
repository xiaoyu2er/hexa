"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { Input } from "@hexa/ui/input";

import { setFormError } from "@/lib/form";
import { invalidateWorkspacesQuery } from "@/lib/queries/workspace";
import {
  DELETE_WORKSPACE_CONFIRMATION,
  type DeleteWorkspaceInput,
  DeleteWorkspaceSchema,
} from "@/lib/zod/schemas/workspace";
import { $deleteWorkspace } from "@/server/client";
import { NEXT_PUBLIC_APP_NAME } from "@hexa/env";
import { Button } from "@hexa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@hexa/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function DeleteWorkspace() {
  const router = useRouter();
  const form = useForm<DeleteWorkspaceInput>({
    resolver: zodResolver(DeleteWorkspaceSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: deleteWorkspace } = useMutation({
    mutationFn: $deleteWorkspace,
    onError: (err) => {
      setFormError(err, setError, "confirm");
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
          Permanently delete your {NEXT_PUBLIC_APP_NAME} workspace, and it's
          respective stats. This action cannot be undone - please proceed with
          caution.
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
                onSubmit={handleSubmit((json) =>
                  deleteWorkspace({
                    param: {
                      workspaceId: json.workspaceId,
                    },
                  }),
                )}
                method="POST"
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Delete Workspace</DialogTitle>
                  <DialogDescription>
                    Permanently delete your {NEXT_PUBLIC_APP_NAME} workspace,
                    and it's respective stats. This action cannot be undone -
                    please proceed with caution.
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
                  <Button
                    variant="destructive"
                    className="w-full"
                    type="submit"
                    loading={isSubmitting}
                  >
                    {DELETE_WORKSPACE_CONFIRMATION}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
