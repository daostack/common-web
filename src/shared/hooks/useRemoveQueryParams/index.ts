import { useCallback } from "react";
import { useHistory, useLocation } from "react-router";
import { removeParamsFromQuery } from "./removeParamsFromQuery";

interface Return {
  removeQueryParams: (queryParams: string | string[]) => void;
}

const useRemoveQueryParams = (): Return => {
  const { replace } = useHistory();
  const { search } = useLocation();

  const removeQueryParams = useCallback(
    (keys: string | string[]) => {
      const newQuery = removeParamsFromQuery(search, keys);

      if (newQuery !== search) {
        replace({
          search: newQuery,
        });
      }
    },
    [search, replace]
  );

  return {
    removeQueryParams,
  };
};

export default useRemoveQueryParams;
