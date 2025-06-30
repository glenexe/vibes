import { useMutation } from "@tanstack/react-query";
import FetchApi from "../utils/Fetch";
const useCustommutation = (options = {}) => {
  return useMutation({
    mutationFn: ({ url, method, info }) => FetchApi(url, method, info),

    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};
export default useCustommutation;
