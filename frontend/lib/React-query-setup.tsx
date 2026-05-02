"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { setQueryClient } from "./poacktbase";

const FIVE_MINUTES = 5 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      gcTime: FIVE_MINUTES,
    },
  },
});

setQueryClient(queryClient);
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
        buttonPosition="top-right"
      />
      {children}
    </QueryClientProvider>
  );
}
