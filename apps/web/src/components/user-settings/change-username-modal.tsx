"use client";

import { Input } from "@hexa/ui/input";

import { useServerAction } from "zsa-react";
import { changeUsernameAction } from "@/lib/actions/user";
import { toast } from "@hexa/ui/sonner";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

import {
  Dialog,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ProviderType } from "@/lib/db";
import {
  ChangeUsernameInput,
  ChangeUsernameSchema,
} from "@/lib/zod/schemas/user";
import { Button } from "@hexa/ui/button";
import { ExclamationTriangleIcon } from "@hexa/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@hexa/ui/alert";
import { useBoolean } from "usehooks-ts";

interface DeleteOAuthAccountProps {
  provider: ProviderType;
}
export const ChangeUsernameModal = NiceModal.create(function ({
  provider,
}: DeleteOAuthAccountProps) {
  const modal = useModal();
  const understandBool = useBoolean();

  const form = useForm<ChangeUsernameInput>({
    resolver: zodResolver(ChangeUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { execute } = useServerAction(changeUsernameAction, {
    onError: ({ err }) => {
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof ChangeUsernameInput, {
              message: message[0],
            });
          }
        });
        if (err.formErrors?.length) {
          setError("username", { message: err.formErrors[0] });
        }
      } else {
        setError("username", { message: err.message });
      }
      modal.reject(err);
    },
    onSuccess: () => {
      toast.success(`Your ${provider} account has been removed.`);
      modal.resolve();
      modal.remove();
    },
  });

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(v: boolean) => {
        if (!v) {
          modal.resolveHide();
        }
        !v && !modal.keepMounted && modal.remove();
      }}
    >
      <DialogContent className="md:max-w-[485px]">
        {understandBool.value ? (
          <>
            <DialogHeader>
              <DialogTitle>Enter a new username</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={handleSubmit((form) => execute(form))}
                method="POST"
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={
                            errors.username ? "border-destructive" : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    className="w-full"
                    type="submit"
                    loading={isSubmitting}
                  >
                    Change username
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Really change your username?</DialogTitle>
              <DialogDescription>
                <Alert variant="destructive" className="mt-2">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Notice</AlertTitle>
                  <AlertDescription>
                    Unexpected bad things will happen if you don’t read this!
                  </AlertDescription>
                </Alert>
                <ul className="pt-3 px-3 list-disc">
                  <li>
                    We <strong>will not</strong> set up redirects for your
                    workspaces.
                  </li>
                  <li>
                    Your old username will be available for anyone to claim.
                  </li>
                  <li>You will need to update any bookmarks or saved links.</li>
                </ul>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="destructive"
                className="w-full"
                type="submit"
                onClick={understandBool.setTrue}
              >
                I understand, let’s change my username
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
