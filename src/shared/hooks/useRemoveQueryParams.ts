import { useCallback } from "react";
import { useHistory, useLocation } from "react-router";
import { parse, stringify } from "query-string";

interface Return {
  removeQueryParams: (queryParams: string | string[]) => void;
}

const useRemoveQueryParams = (): Return => {
  const { replace } = useHistory();
  const { search } = useLocation();

  const removeQueryParams = useCallback(
    (keys: string | string[]) => {
      const queryParams = parse(search);
      const keysArray = typeof keys === "string" ? [keys] : keys;
      let isAnyParamRemoved = false;

      keysArray.forEach((key) => {
        if (key in queryParams) {
          delete queryParams[key];
          isAnyParamRemoved = true;
        }
      });

      if (isAnyParamRemoved) {
        replace({
          search: stringify(queryParams),
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
