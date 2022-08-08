import { ParsedQuery } from "query-string";
import {
  AUTH_CODE_FOR_SIGN_UP,
  QueryParamKey,
  ROUTE_PATHS,
} from "@/shared/constants";
import { matchRoute } from "@/shared/utils";

export const getAuthCode = (
  queryParams: ParsedQuery,
  pathname: string
): string => {
  const authCode = queryParams[QueryParamKey.AuthCode];

  if (typeof authCode === "string") {
    return authCode;
  }
  if (
    matchRoute(pathname, ROUTE_PATHS.DEAD_SEA, { exact: true }) &&
    typeof queryParams[QueryParamKey.DeadSeaIntegrationAmount] === "string"
  ) {
    return AUTH_CODE_FOR_SIGN_UP;
  }

  return "";
};
