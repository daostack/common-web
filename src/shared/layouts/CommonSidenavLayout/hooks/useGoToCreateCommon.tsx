import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";

export const useGoToCreateCommon = (): (() => void) => {
  const history = useHistory();

  return useCallback(() => {
    history.push(ROUTE_PATHS.V04_COMMON_CREATION);
  }, [history.push]);
};
