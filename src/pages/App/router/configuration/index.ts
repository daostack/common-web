import { getPathNestingLevel, mapRoutesToPaths } from "../helpers";
import {
  LayoutConfiguration,
  LayoutConfigurationWithRouteProps,
} from "../types";
import {
  COMMON_SIDENAV_LAYOUT_CONFIGURATION,
  CommonSidenavLayoutRouteOptions,
} from "./commonSidenavLayout";
import { EMPTY_LAYOUT_CONFIGURATION } from "./emptyLayout";
import {
  MULTIPLE_SPACES_LAYOUT_CONFIGURATION,
  MultipleSpacesLayoutRouteOptions,
} from "./multipleSpacesLayout";
import { OLD_LAYOUT_CONFIGURATION, OldLayoutRouteOptions } from "./oldLayout";
import {
  SIDENAV_LAYOUT_CONFIGURATION,
  SidenavLayoutRouteOptions,
} from "./sidenavLayout";

type LayoutRouteOptions =
  | OldLayoutRouteOptions
  | SidenavLayoutRouteOptions
  | CommonSidenavLayoutRouteOptions
  | MultipleSpacesLayoutRouteOptions
  | unknown;

const CONFIGURATIONS: LayoutConfiguration<LayoutRouteOptions>[] = [
  EMPTY_LAYOUT_CONFIGURATION,
  OLD_LAYOUT_CONFIGURATION,
  SIDENAV_LAYOUT_CONFIGURATION,
  COMMON_SIDENAV_LAYOUT_CONFIGURATION,
  MULTIPLE_SPACES_LAYOUT_CONFIGURATION,
];

export const ROUTES: LayoutConfigurationWithRouteProps<LayoutRouteOptions>[] =
  CONFIGURATIONS.map((configuration) => {
    // Sort paths like: /path/nested/nested2 -> /path/nested -> /path
    const routes = [...configuration.routes].sort(
      (prevRoute, nextRoute) =>
        getPathNestingLevel(nextRoute.path) -
        getPathNestingLevel(prevRoute.path),
    );

    return {
      ...configuration,
      routes,
      path: mapRoutesToPaths(configuration.routes),
      exact: true,
    };
  });

export type {
  OldLayoutRouteOptions,
  SidenavLayoutRouteOptions,
  CommonSidenavLayoutRouteOptions,
  MultipleSpacesLayoutRouteOptions,
};
