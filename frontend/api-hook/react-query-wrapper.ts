import { QueryKey, useMutation, useQuery, UseQueryOptions,MutationKey } from "@tanstack/react-query";
import { GetRequestNormal } from "./api-hook";



export function useQueryWrapper<T>(
  key: QueryKey,
  url: string,
  options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>
) {


  return useQuery<T, Error>({
    queryKey: key,
    queryFn: ()=>GetRequestNormal<T>(url),
  
    ...options,
  });
}

