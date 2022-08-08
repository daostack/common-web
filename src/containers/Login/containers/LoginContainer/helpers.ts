import { ParsedQuery } from "query-string";
import { AUTH_CODE_QUERY_PARAM_KEY } from "@/containers/Login/constants";
import { AUTH_CODE_FOR_SIGN_UP, ROUTE_PATHS } from "@/shared/constants";
import { matchRoute } from "@/shared/utils";

export const getAuthCode = (
  queryParams: ParsedQuery,
  pathname: string
): string => {
  const authCode = queryParams[AUTH_CODE_QUERY_PARAM_KEY];

  if (typeof authCode === "string") {
    return authCode;
  }
  if (matchRoute(pathname, ROUTE_PATHS.DEAD_SEA, { exact: true })) {
    return AUTH_CODE_FOR_SIGN_UP;
  }

  return "";
};
