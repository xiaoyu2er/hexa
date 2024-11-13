'use client';

import { queryUserOauthAccountsOptions } from '@/lib/queries/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@hexa/ui/dropdown-menu';
import {
  EllipsisIcon,
  GithubIcon,
  GoogleIcon,
  MoveRightIcon,
  UserPlusIcon,
} from '@hexa/ui/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@hexa/ui/popover';

import Link from 'next/link';
import { DeleteOauthAccountModal } from './delete-account-modal';

export function EditOauthAccount() {
  const { data: accounts, refetch } = useSuspenseQuery(
    queryUserOauthAccountsOptions
  );
  const hasGoogleAccount = accounts.some((a) => a.provider === 'GOOGLE');
  const hasGithubAccount = accounts.some((a) => a.provider === 'GITHUB');

  const modal = useModal(DeleteOauthAccountModal);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your connected accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex max-w-md flex-col">
            {accounts
              // .sort((a, b) => (a.primary ? -1 : 1))
              .map((account) => {
                return (
                  <Button
                    key={account.provider}
                    className="justify-between"
                    variant="ghost"
                  >
                    <p className="flex items-center gap-2 font-medium text-sm leading-none">
                      {account.provider === 'GITHUB' && (
                        <GithubIcon className="h-4 w-4" />
                      )}
                      {account.provider === 'GOOGLE' && (
                        <GoogleIcon className="h-4 w-4" />
                      )}
                      {account.provider[0] +
                        account.provider.slice(1).toLowerCase()}
                      {account.username && (
                        <span className="text-gray-600 text-sm">
                          {account.username}
                        </span>
                      )}
                    </p>

                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisIcon className="h4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => {
                            modal
                              .show({ provider: account.provider })
                              .then(() => refetch());
                          }}
                        >
                          Remove account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Button>
                );
              })}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={hasGithubAccount && hasGoogleAccount}
                  className="group items-center justify-start gap-2 disabled:cursor-not-allowed"
                >
                  <UserPlusIcon className="h-4 w-4" /> Add new account
                  {(!hasGithubAccount || !hasGoogleAccount) && (
                    <MoveRightIcon className="hidden h-4 w-4 animate-in group-hover:block" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-md flex-col p-0">
                {!hasGithubAccount && (
                  <Button
                    variant="ghost"
                    className="h-11 w-full justify-start "
                    asChild
                  >
                    <Link href="/api/oauth/github" prefetch={false}>
                      <GithubIcon className="mr-2 h-4 w-4" />
                      Github
                    </Link>
                  </Button>
                )}
                {!hasGoogleAccount && (
                  <Button
                    variant="ghost"
                    className="h-11 w-full justify-start"
                    asChild
                  >
                    <Link href="/api/oauth/google" prefetch={false}>
                      <GoogleIcon className="mr-2 h-4 w-4" />
                      Google
                    </Link>
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
