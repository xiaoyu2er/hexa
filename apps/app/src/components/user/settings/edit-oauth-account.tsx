'use client';

import { queryUserOauthAccountsOptions } from '@/lib/queries/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { useQuery } from '@tanstack/react-query';

import { useModal } from '@ebay/nice-modal-react';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import {
  EllipsisIcon,
  GithubIcon,
  GoogleIcon,
  MoveRightIcon,
  UserPlusIcon,
} from '@hexa/ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DeleteOauthAccountModal } from './delete-oauth-account-modal';

export function EditOauthAccount() {
  const { data: accounts = [], refetch } = useQuery(
    queryUserOauthAccountsOptions
  );
  const hasGoogleAccount = accounts.some((a) => a.provider === 'GOOGLE');
  const hasGithubAccount = accounts.some((a) => a.provider === 'GITHUB');

  const modal = useModal(DeleteOauthAccountModal);
  const router = useRouter();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Connected accounts</CardTitle>
          <CardDescription>Manage your connected accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex max-w-md flex-col gap-1">
            {accounts
              // .sort((a, b) => (a.primary ? -1 : 1))
              .map((account) => {
                return (
                  <Dropdown
                    placement="bottom-end"
                    key={account.provider}
                    backdrop="transparent"
                  >
                    <DropdownTrigger>
                      <Button
                        key={account.provider}
                        className="justify-between"
                        variant="light"
                        endContent={<EllipsisIcon className="h4 w-4" />}
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
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="delete"
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onPress={() => {
                          modal
                            .show({ provider: account.provider })
                            .then(() => refetch());
                        }}
                      >
                        Remove account
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                );
              })}

            <Popover
              placement="bottom-end"
              backdrop="transparent"
              classNames={{
                base: 'w-[200px] p-0',
                content: 'p-0',
              }}
            >
              <PopoverTrigger>
                <Button
                  variant="light"
                  disabled={hasGithubAccount && hasGoogleAccount}
                  className="justify-between disabled:cursor-not-allowed"
                  endContent={
                    !hasGithubAccount || !hasGoogleAccount ? (
                      <MoveRightIcon className="hidden h-4 w-4 animate-in group-hover:block" />
                    ) : null
                  }
                >
                  <p className="flex items-center gap-2 font-medium text-sm leading-none">
                    <UserPlusIcon className="h-4 w-4" /> Add new account
                  </p>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Listbox
                  aria-label="Actions"
                  variant="flat"
                  selectionMode="none"
                  classNames={{
                    list: 'p-0',
                  }}
                  onAction={(key) => {
                    // console.log(key);
                    router.push(`/api/oauth/${key}`);
                  }}
                >
                  {hasGithubAccount ? null : (
                    <ListboxItem
                      key="github"
                      startContent={<GithubIcon className="h-4 w-4" />}
                      classNames={{
                        base: 'w-full [&>a]:w-full [&>a]:flex [&>a]:items-center [&>a]:gap-2',
                      }}
                    >
                      <Link href="/api/oauth/github" prefetch={false}>
                        Github
                      </Link>
                    </ListboxItem>
                  )}
                  {hasGoogleAccount ? null : (
                    <ListboxItem
                      key="google"
                      startContent={<GoogleIcon className="h-4 w-4" />}
                      classNames={{
                        base: 'w-full [&>a]:w-full [&>a]:flex [&>a]:items-center [&>a]:gap-2',
                      }}
                    >
                      <Link href="/api/oauth/google" prefetch={false}>
                        Google
                      </Link>
                    </ListboxItem>
                  )}
                </Listbox>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
