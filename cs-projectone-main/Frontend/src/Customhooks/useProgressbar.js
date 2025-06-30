import { useEffect } from "react";
import { useIsFetching } from "@tanstack/react-query";
import NProgress from "nprogress";

const useProgressBar = () => {
  const isFetching = useIsFetching(); // Tracks any active query

  useEffect(() => {
    if (isFetching > 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching]);
};

export default useProgressBar;
