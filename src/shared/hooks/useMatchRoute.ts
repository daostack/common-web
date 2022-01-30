import { useMemo } from "react";
import { useLocation, RouteProps } from "react-router-dom";
import { ROUTE_PATHS } from "../../shared/constants";
import { matchRoute } from "../../shared/utils";

const useMatchRoute = (path: ROUTE_PATHS, props: RouteProps = {}): boolean => {
  const { pathname } = useLocation();

  return useMemo(() => matchRoute(pathname, path, props), [
    pathname,
    path,
    props,
  ]);
};

export default useMatchRoute;
