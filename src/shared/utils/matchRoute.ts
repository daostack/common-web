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

export const getRouteParams = <Params = Record<string, string>>(
  pathname: string,
  path: ROUTE_PATHS,
  props: RouteProps = {},
): Params | null => {
  const pathMatch = matchPath<Params>(pathname, {
    path,
    exact: true,
    ...props,
  });

  return pathMatch?.params || null;
};

export const getParamsFromOneOfRoutes = <Params = Record<string, string>>(
  pathname: string,
  paths: ROUTE_PATHS[],
  props: RouteProps = {},
): Params | null => {
  let params: Params | null = null;

  paths.some((path) => {
    params = getRouteParams(pathname, path, props);
    return params;
  });

  return params;
};
