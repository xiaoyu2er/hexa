'use client';

import { queryUserEmailsOptions } from '@/lib/queries/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { toast } from '@hexa/ui/sonner';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { VerifyPasscode } from '@/components/auth/verify-passcode';
import { useModal } from '@ebay/nice-modal-react';
import { MAX_EMAILS } from '@hexa/const';
import {
  $addUserEmailResendPasscode,
  $addUserEmailSendPasscode,
  $addUserEmailVerifyPasscode,
  $updateUserPrimaryEmail,
} from '@hexa/server/api';
import { Badge } from '@hexa/ui/badge';

import { EllipsisIcon, MailPlusIcon, MoveRightIcon } from '@hexa/ui/icons';
import { useMutation } from '@tanstack/react-query';
import { useBoolean } from 'usehooks-ts';
import { AddUserEmail } from './add-user-email';
import { DeleteUserEmailModal } from './delete-user-email-modal';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

export function EditUserEmails() {
  const { data: emails = [], refetch } = useQuery(queryUserEmailsOptions);
  const emailCardBool = useBoolean();

  const modal = useModal(DeleteUserEmailModal);
  const [verifingEmail, setVerifingEmail] = useState<string | undefined>();
  const [passcodeId, setPasscodeId] = useState<string>('');

  const { mutateAsync: setUserPrimaryEmail, isPending: isSettingPrimaryEmail } =
    useMutation({
      mutationFn: $updateUserPrimaryEmail,
      onError: (error) => {
        toast.error(`${error.message}`);
        refetch();
      },
      onSuccess: () => {
        toast.success('Primary email is set');
        refetch();
      },
    });

  const { mutateAsync: sendPasscode, isPending: isSendingPasscode } =
    useMutation({
      mutationFn: $addUserEmailSendPasscode,
      onError: (err) => {
        toast.error(`${err.message}`);
      },
      onSuccess: (data) => {
        toast.success('The verification code has been sent!');
        data && setPasscodeId(data.id);
        data && setVerifingEmail(data.email);
        emailCardBool.setFalse();
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
          <div className="flex max-w-md flex-col">
            {emails
              // .sort((a, b) => (a.primary ? -1 : 1))
              .map((email) => {
                const disabledKeys = [
                  'delete',
                  isSettingPrimaryEmail || !email.verified
                    ? 'set-primary'
                    : undefined,
                  isSendingPasscode ? 'verify-email' : undefined,
                ].filter(Boolean) as string[];
                return (
                  <>
                    <Dropdown key={email.email} placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          className="justify-between"
                          variant="light"
                          key={email.email}
                          endContent={<EllipsisIcon className="h4 ml-2 w-4" />}
                        >
                          <p className="flex items-center gap-2 overflow-auto font-medium text-sm leading-none">
                            <span className="shrink overflow-hidden text-ellipsis text-nowrap">
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
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu disabledKeys={disabledKeys}>
                        <DropdownItem
                          key="set-primary"
                          onPress={() =>
                            setUserPrimaryEmail({
                              json: { email: email.email },
                            })
                          }
                        >
                          Set as primary
                        </DropdownItem>
                        {email.verified ? null : (
                          <DropdownItem
                            key="verify-email"
                            onPress={() => {
                              sendPasscode({ json: { email: email.email } });
                            }}
                          >
                            Verify email
                          </DropdownItem>
                        )}

                        <DropdownItem
                          key="delete"
                          color="danger"
                          className="text-danger"
                          onPress={() => {
                            modal
                              .show({ email: email.email })
                              .then(() => refetch());
                          }}
                        >
                          Remove email
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    {!email.verified && verifingEmail === email.email && (
                      <VerifyPasscode
                        passcodeId={passcodeId}
                        className="my-2"
                        email={email.email}
                        showEmail={false}
                        onResend={(json) => {
                          return $addUserEmailResendPasscode({
                            json,
                          });
                        }}
                        onVerify={(json) => {
                          return $addUserEmailVerifyPasscode({
                            json,
                          });
                        }}
                        onSuccess={() => {
                          refetch();
                          setVerifingEmail(undefined);
                          toast.success('Email verified!');
                        }}
                        onCancel={() => setVerifingEmail(undefined)}
                      />
                    )}
                  </>
                );
              })}

            {!emailCardBool.value && (
              <Button
                variant="light"
                isDisabled={emails.length >= MAX_EMAILS}
                className="justify-between"
                onPress={emailCardBool.setTrue}
                endContent={
                  emails.length < MAX_EMAILS ? (
                    <MoveRightIcon className="hidden h-4 w-4 animate-in group-hover:block" />
                  ) : null
                }
              >
                <p className="flex items-center gap-2 overflow-auto font-medium text-sm leading-none">
                  <MailPlusIcon className="h-4 w-4" /> Add new email
                </p>
              </Button>
            )}
          </div>

          {emailCardBool.value && (
            <AddUserEmail
              onCancel={emailCardBool.setFalse}
              onSuccess={({ email, id }) => {
                refetch();
                email && setVerifingEmail(email);
                id && setPasscodeId(id);
                emailCardBool.setFalse();
              }}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
