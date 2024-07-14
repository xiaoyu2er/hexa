"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { queryUserOAuthAccountsOptions } from "@/lib/queries/user";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@hexa/ui/button";
import {
  EllipsisIcon,
  GithubIcon,
  GoogleIcon,
  MoveRightIcon,
  UserPlusIcon,
} from "@hexa/ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hexa/ui/dropdown-menu";
import { useModal } from "@ebay/nice-modal-react";
import { Popover, PopoverContent, PopoverTrigger } from "@hexa/ui/popover";

import { DeleteOAuthAccountModal } from "./delete-account-modal";
import Link from "next/link";

export function EditOAuthAccount() {
  const { data: accounts, refetch } = useSuspenseQuery(
    queryUserOAuthAccountsOptions,
  );
  const hasGoogleAccount = accounts.some((a) => a.provider === "GOOGLE");
  const hasGithubAccount = accounts.some((a) => a.provider === "GITHUB");

  const modal = useModal(DeleteOAuthAccountModal);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your connected accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md flex flex-col">
            {accounts
              // .sort((a, b) => (a.primary ? -1 : 1))
              .map((account) => {
                return (
                  <>
                    <Button className="justify-between" variant="ghost">
                      <p className="text-sm font-medium leading-none flex gap-2 items-center">
                        {account.provider === "GITHUB" && (
                          <GithubIcon className="w-4 h-4" />
                        )}
                        {account.provider === "GOOGLE" && (
                          <GoogleIcon className="w-4 h-4" />
                        )}
                        {account.provider[0] +
                          account.provider.slice(1).toLowerCase()}{" "}
                        {account.username && (
                          <span className="text-sm text-gray-600">
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
                  </>
                );
              })}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={hasGithubAccount && hasGoogleAccount}
                  className="gap-2 items-center justify-start group disabled:cursor-not-allowed"
                >
                  <UserPlusIcon className="w-4 h-4" /> Add new account
                  {(!hasGithubAccount || !hasGoogleAccount) && (
                    <MoveRightIcon className="hidden w-4 h-4 group-hover:block animate-in" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col p-0 w-md">
                {!hasGithubAccount && (
                  <Button
                    variant="ghost"
                    className="w-full h-11 justify-start "
                    asChild
                  >
                    <Link href="/oauth/github">
                      <GithubIcon className="w-4 h-4 mr-2" />
                      Github
                    </Link>
                  </Button>
                )}
                {!hasGoogleAccount && (
                  <Button
                    variant="ghost"
                    className="w-full h-11 justify-start"
                    asChild
                  >
                    <Link href="/oauth/google">
                      <GoogleIcon className="w-4 h-4 mr-2" />
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
