"use client";

import { Input } from "@hexa/ui/input";

import { removeUserOAuthAccountAction } from "@/lib/actions/user";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { toast } from "@hexa/ui/sonner";
import { useServerAction } from "zsa-react";

import type { ProviderType } from "@/lib/db";
import {
  type DeleteOAuthAccountInput,
  DeleteOAuthAccountSchema,
} from "@/lib/zod/schemas/user";
import { Button } from "@hexa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@hexa/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface DeleteOAuthAccountProps {
  provider: ProviderType;
}
export const DeleteOAuthAccountModal = NiceModal.create(
  ({ provider }: DeleteOAuthAccountProps) => {
    const modal = useModal();

    const form = useForm<DeleteOAuthAccountInput>({
      resolver: zodResolver(DeleteOAuthAccountSchema),
      defaultValues: {
        provider: "",
      },
    });

    const {
      handleSubmit,
      setError,
      formState: { isSubmitting, errors },
    } = form;

    const { execute } = useServerAction(removeUserOAuthAccountAction, {
      onError: ({ err }) => {
        if (err.code === "INPUT_PARSE_ERROR") {
          for (const [field, message] of Object.entries(err.fieldErrors)) {
            if (message) {
              setError(field as keyof DeleteOAuthAccountInput, {
                message: message[0],
              });
            }
          }
          if (err.formErrors?.length) {
            setError("provider", { message: err.formErrors[0] });
          }
        } else {
          setError("provider", { message: err.message });
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Connected Account</DialogTitle>
            <DialogDescription>
              Warning: This will remove your {provider} account from your
              profile.
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
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To verify, type{" "}
                      <span className="font-bold">{provider}</span> below
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={errors.provider ? "border-destructive" : ""}
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
                  Delete Connected Account
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);
