import { QueryClient } from "@tanstack/react-query";

export function invalidateCategoryQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: (query) =>
      query.queryKey.some(
        (key) =>
          typeof key === "string" && key.toLowerCase().includes("categor")
      ),
  });
}
