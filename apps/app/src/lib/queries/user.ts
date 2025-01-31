import {
  $getUserEmails,
  $getUserInfo,
  $getUserOauthAccounts,
} from '@hexa/server/api';
import { getQueryClient } from '@hexa/ui/get-query-client';
import { queryOptions } from '@tanstack/react-query';

export const queryUserOptions = queryOptions({
  queryKey: ['user/info'],
  queryFn: $getUserInfo,
});

export const invalidateUser = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: queryUserOptions.queryKey,
  });
};

export const queryUserEmailsOptions = queryOptions({
  queryKey: ['user/emails'],
  queryFn: $getUserEmails,
});

export const invalidateUserEmails = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: queryUserEmailsOptions.queryKey,
  });
};

export const queryUserOauthAccountsOptions = queryOptions({
  queryKey: ['user/oauth-accounts'],
  queryFn: $getUserOauthAccounts,
});
