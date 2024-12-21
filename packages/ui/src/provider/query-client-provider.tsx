'use client';

import { getQueryClient } from '@hexa/ui/get-query-client';
import { QueryClientProvider as InnerQueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <InnerQueryClientProvider client={queryClient}>
      {children}
    </InnerQueryClientProvider>
  );
};
