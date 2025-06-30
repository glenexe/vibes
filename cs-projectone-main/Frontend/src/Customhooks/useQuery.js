import { useQuery } from "@tanstack/react-query";
import FetchApi from "../utils/Fetch";

export const useCustomQuery = (querykey, url, options = {}) => {
  return useQuery({
    queryKey: [querykey],
    queryFn: () => FetchApi(url),
    retry: false,
    ...options,
  });
};
