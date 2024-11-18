import { getQueryClient } from '@/components/providers/get-query-client';
import { $getUserEmails, $getUserInfo, $getUserOauthAccounts } from '@/lib/api';
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
