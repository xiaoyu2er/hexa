"use client";

import { Input } from "@hexa/ui/input";

import { useServerAction } from "zsa-react";
import { removeUserEmailAction } from "@/lib/actions/user";
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
import { OnlyEmailInput, OnlyEmailSchema } from "@/lib/zod/schemas/auth";

interface DeleteUserEmailProps {
  email: string;
}
export const DeleteUserEmailModal = NiceModal.create(function ({
  email,
}: DeleteUserEmailProps) {
  const modal = useModal();

  const form = useForm<OnlyEmailInput>({
    resolver: zodResolver(OnlyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { execute } = useServerAction(removeUserEmailAction, {
    onError: ({ err }) => {
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof OnlyEmailInput, {
              message: message[0],
            });
          }
        });
        if (err.formErrors?.length) {
          setError("email", { message: err.formErrors[0] });
        }
      } else {
        setError("email", { message: err.message });
      }
      modal.reject(err);
    },
    onSuccess: () => {
      toast.success("Email deleted successfully");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Email</DialogTitle>
          <DialogDescription>
            Warning: Permanently delete your email, and their respective stats.
            This action cannot be undone - please proceed with caution.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((form) => execute(form))}
            method="POST"
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    To verify, type <span className="font-bold">{email}</span>{" "}
                    below
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={errors.email ? "border-destructive" : ""}
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
                Delete Email
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
