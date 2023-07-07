import queryString, { parse } from "query-string";
import { history } from "@/shared/appConfig";
import { SIDENAV_KEY, SIDENAV_OPEN } from "@/shared/constants";

export const openSidenav = () => {
  const params = queryString.parse(window.location.search);

  const search = queryString.stringify({
    ...params,
    [SIDENAV_KEY]: SIDENAV_OPEN,
  });
  history.push({
    pathname: window.location.pathname,
    search,
  });
};

export const closeSidenav = () => {
  window.location.search = "";
};

export const checkIsSidenavOpen = (queryParams: ReturnType<typeof parse>) =>
  queryParams[SIDENAV_KEY] === SIDENAV_OPEN;
