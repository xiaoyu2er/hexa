import { DataTag, UseQueryOptions, queryOptions } from "@tanstack/react-query";
import { getUserAction } from "@/lib/actions/user";
import { User } from "lucia";

export const queryUserOptions: UseQueryOptions<User, Error, User, string[]> & {
  initialData?: undefined;
} & {
  queryKey: DataTag<string[], User>;
} = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    const [res, err] = await getUserAction();
    if (err) throw err;
    return res.user;
  },
});
