import { mapRoutesToPaths } from "../helpers";
import {
  LayoutConfiguration,
  LayoutConfigurationWithRouteProps,
} from "../types";
import {
  COMMON_SIDENAV_LAYOUT_CONFIGURATION,
  CommonSidenavLayoutRouteOptions,
} from "./commonSidenavLayout";
import { OLD_LAYOUT_CONFIGURATION, OldLayoutRouteOptions } from "./oldLayout";
import {
  SIDENAV_LAYOUT_CONFIGURATION,
  SidenavLayoutRouteOptions,
} from "./sidenavLayout";

type LayoutRouteOptions =
  | OldLayoutRouteOptions
  | SidenavLayoutRouteOptions
  | CommonSidenavLayoutRouteOptions
  | unknown;

const CONFIGURATIONS: LayoutConfiguration<LayoutRouteOptions>[] = [
  OLD_LAYOUT_CONFIGURATION,
  SIDENAV_LAYOUT_CONFIGURATION,
  COMMON_SIDENAV_LAYOUT_CONFIGURATION,
];

export const ROUTES: LayoutConfigurationWithRouteProps<LayoutRouteOptions>[] =
  CONFIGURATIONS.map((configuration) => {
    // Sort paths like: /path/nested/nested2 -> /path/nested -> /path
    const routes = [...configuration.routes].sort((prevRoute, nextRoute) =>
      prevRoute < nextRoute ? 1 : -1,
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
};
