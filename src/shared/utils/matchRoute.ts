import { matchPath, RouteProps } from "react-router";
import { ROUTE_PATHS } from "../constants";

export const matchRoute = (
  pathname: string,
  path: ROUTE_PATHS,
  props: RouteProps = {},
): boolean => {
  const pathMatch = matchPath(pathname, {
    path,
    exact: true,
    ...props,
  });

  return Boolean(pathMatch);
};

export const matchOneOfRoutes = (
  pathname: string,
  paths: ROUTE_PATHS[],
  props: RouteProps = {},
): boolean => paths.some((path) => matchRoute(pathname, path, props));
