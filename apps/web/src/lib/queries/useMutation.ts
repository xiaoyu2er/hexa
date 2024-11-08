import { useMutation } from "@tanstack/react-query";
import { ZodError, type ZodIssue } from "zod";

const useCustomMutation: typeof useMutation = ({
  onSuccess,
  onError,
  ...others
}) => {
  return useMutation({
    ...others,
    onSuccess: async (res, ...args) => {
      // @ts-ignore
      if (!res.ok) {
        try {
          // @ts-ignore
          const error = await res.json();
          if (error.error) {
            if (error.error.name === "ZodError") {
              // @ts-ignore
              return onError?.(new ZodError(error.error.issues), ...args);
            }
            if (error.error.message) {
              // @ts-ignore
              return onError?.(new Error(error.error.message), ...args);
            }
          }
          throw res;
        } catch (e) {
          return onError?.(
            // @ts-ignore
            new Error(`[${res.status}] ${res.statusText}`),
            ...args,
          );
        }
      } else {
        return onSuccess?.(res, ...args);
      }
    },
    onError,
  });
};

export default useCustomMutation;
