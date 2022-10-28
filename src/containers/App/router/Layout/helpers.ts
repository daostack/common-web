import { ROUTE_PATHS } from "@/shared/constants";
import { Route } from "../types";

const ALL_ROUTES = Object.values(ROUTE_PATHS);

export const mapRoutesToPaths = (routes: Route[]): string[] => {
  const paths = routes.reduce<string[]>((acc, route) => {
    const nextRoutes = [...acc, route.path];

    if (route.exact) {
      return nextRoutes;
    }

    const nestedRoutes = ALL_ROUTES.filter((path) =>
      path.startsWith(`${route.path}/`),
    );

    return [...nextRoutes, ...nestedRoutes];
  }, []);

  return Array.from(new Set(paths));
};
