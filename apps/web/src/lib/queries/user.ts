import { getQueryClient } from "@/components/providers/get-query-client";
import {
  $getUserEmails,
  $getUserInfo,
  $getUserOAuthAccounts,
} from "@/server/client";
import { queryOptions } from "@tanstack/react-query";

export const queryUserOptions = queryOptions({
  queryKey: ["user"],
  queryFn: $getUserInfo,
});

export const queryUserEmailsOptions = queryOptions({
  queryKey: ["user/emails"],
  queryFn: $getUserEmails,
});

export const invalidateUserEmails = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: queryUserEmailsOptions.queryKey,
  });
};

export const queryUserOAuthAccountsOptions = queryOptions({
  queryKey: ["user/oauth-accounts"],
  queryFn: $getUserOAuthAccounts,
});
