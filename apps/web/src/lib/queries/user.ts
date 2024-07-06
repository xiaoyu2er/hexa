import { queryOptions } from "@tanstack/react-query";
import { getUserAction } from "@/lib/actions/user";

export const queryUserOptions = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    const [res, err] = await getUserAction();
    if (err) throw err;
    return res.user;
  },
});
