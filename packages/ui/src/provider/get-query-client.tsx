import { QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (browserQueryClient) {
    return browserQueryClient;
  }
  browserQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 100, // 100ms
      },
    },
  });
  return browserQueryClient;
}
