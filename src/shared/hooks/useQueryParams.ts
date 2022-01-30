import { useMemo } from "react";
import { useLocation } from "react-router";
import { parse } from "query-string";

const useQueryParams = (): ReturnType<typeof parse> => {
  const { search } = useLocation();

  return useMemo(() => parse(search), [search]);
};

export default useQueryParams;
