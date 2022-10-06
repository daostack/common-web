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
): { authCode: string; shouldOpenLoginModal: boolean } => {
  const authCode = queryParams[QueryParamKey.AuthCode];

  if (typeof authCode === "string") {
    return {
      authCode,
      shouldOpenLoginModal: true,
    };
  }
  if (
    matchRoute(pathname, ROUTE_PATHS.SUPPORTERS, { exact: true }) ||
    matchRoute(pathname, ROUTE_PATHS.COMMON_DETAIL, { exact: true })
  ) {
    return {
      authCode: AUTH_CODE_FOR_SIGN_UP,
      shouldOpenLoginModal: false,
    };
  }

  return { authCode: "", shouldOpenLoginModal: false };
};
