import { matchPath, RouteProps } from 'react-router';
import { ROUTE_PATHS } from "../constants";

export const matchRoute = (pathname: string, path: ROUTE_PATHS, props: RouteProps = {}): boolean => {
  const pathMatch = matchPath(pathname, {
    path,
    exact: true,
    ...props,
  });

  return Boolean(pathMatch);
};
