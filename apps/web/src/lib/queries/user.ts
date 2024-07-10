import { DataTag, UseQueryOptions, queryOptions } from "@tanstack/react-query";
import { getUserAction, getUserEmailsAction } from "@/lib/actions/user";
import { getQueryClient } from "@/providers/get-query-client";

export const queryUserOptions = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    const [res, err] = await getUserAction();
    if (err) throw err;
    return res.user;
  },
});

export const queryUserEmailsOptions = queryOptions({
  queryKey: ["user/emails"],
  queryFn: async () => {
    const [res, err] = await getUserEmailsAction();
    if (err) throw err;
    return res.emails;
  },
});

export const invalidateUserEmails = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: queryUserEmailsOptions.queryKey,
  });
};
