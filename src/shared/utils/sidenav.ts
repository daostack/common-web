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
  const params = queryString.parse(window.location.search);

  if (params[SIDENAV_KEY]) {
    delete params[SIDENAV_KEY];
    history.push({
      search: queryString.stringify(params),
    });
  }
};

export const checkIsSidenavOpen = (queryParams: ReturnType<typeof parse>) =>
  queryParams[SIDENAV_KEY] === SIDENAV_OPEN;
