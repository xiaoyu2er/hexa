"use client";

import { queryUserEmailsOptions } from "@/lib/queries/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { toast } from "@hexa/ui/sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { VerifyPasscode } from "@/components/auth/verify-passcode-form";
import { MAX_EMAILS } from "@/lib/const";
import { $setUserPrimaryEmail } from "@/server/client";
import { useModal } from "@ebay/nice-modal-react";
import { Badge } from "@hexa/ui/badge";
import { Button } from "@hexa/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hexa/ui/dropdown-menu";
import { EllipsisIcon, MailPlusIcon, MoveRightIcon } from "@hexa/ui/icons";
import { useMutation } from "@tanstack/react-query";
import { useBoolean } from "usehooks-ts";
import { AddUserEmailForm } from "./add-user-email-form";
import { DeleteUserEmailModal } from "./delete-user-email-modal";

export function EditUserEmails() {
  const { data: emails, refetch } = useSuspenseQuery(queryUserEmailsOptions);
  const emailCardBool = useBoolean();

  const modal = useModal(DeleteUserEmailModal);
  const [verifingEmail, setVerifingEmail] = useState<string | undefined>();

  const { mutateAsync: setUserPrimaryEmail, isPending } = useMutation({
    mutationFn: $setUserPrimaryEmail,
    onError: (error) => {
      toast.error(`Failed to set primary email${error.message}`);
      refetch();
    },
    onSuccess: () => {
      toast.success("Primary email set");
      refetch();
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Emails</CardTitle>
          <CardDescription>
            You can add multiple email addresses to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md flex flex-col">
            {emails
              // .sort((a, b) => (a.primary ? -1 : 1))
              .map((email) => {
                return (
                  <>
                    <Button
                      className="justify-between"
                      variant="ghost"
                      key={email.email}
                    >
                      <p className="text-sm font-medium leading-none flex gap-2 items-center overflow-auto">
                        <span className="shrink text-nowrap text-ellipsis overflow-hidden">
                          {email.email}
                        </span>
                        {email.primary && (
                          <Badge className="text-xs">Primary</Badge>
                        )}
                        {!email.verified && (
                          <Badge variant="outline" className="text-xs">
                            Unverified
                          </Badge>
                        )}
                      </p>

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisIcon className="h4 w-4 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={isPending}
                            onClick={() =>
                              setUserPrimaryEmail({
                                json: { email: email.email },
                              })
                            }
                          >
                            Set as primary
                          </DropdownMenuItem>
                          {!email.verified && (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setVerifingEmail(email.email);
                                emailCardBool.setFalse();
                              }}
                            >
                              Verify email
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => {
                              modal
                                .show({ email: email.email })
                                .then(() => refetch());
                            }}
                          >
                            Remove email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Button>

                    {!email.verified && verifingEmail === email.email && (
                      <VerifyPasscode
                        className="my-2"
                        email={email.email}
                        showEmail={false}
                        type="VERIFY_EMAIL"
                        onSuccess={() => {
                          refetch();
                          setVerifingEmail(undefined);
                          toast.success("Email verified!");
                        }}
                        onCancel={() => setVerifingEmail(undefined)}
                      />
                    )}
                  </>
                );
              })}

            {!emailCardBool.value && (
              <Button
                variant="ghost"
                disabled={emails.length >= MAX_EMAILS}
                className="gap-2 items-center justify-start group disabled:cursor-not-allowed"
                onClick={emailCardBool.setTrue}
              >
                <MailPlusIcon className="w-4 h-4" /> Add new email
                {emails.length < MAX_EMAILS && (
                  <MoveRightIcon className="hidden w-4 h-4 group-hover:block animate-in" />
                )}
              </Button>
            )}
          </div>

          {emailCardBool.value && (
            <AddUserEmailForm
              onCancel={emailCardBool.setFalse}
              onSuccess={({ email }) => {
                refetch();
                email && setVerifingEmail(email);
                emailCardBool.setFalse();
              }}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
