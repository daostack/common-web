import { mapRoutesToPaths } from "../helpers";
import {
  LayoutConfiguration,
  LayoutConfigurationWithRouteProps,
} from "../types";
import { OLD_LAYOUT_CONFIGURATION } from "./oldLayout";
import { SIDENAV_LAYOUT_CONFIGURATION } from "./sidenavLayout";

const CONFIGURATIONS: LayoutConfiguration[] = [
  OLD_LAYOUT_CONFIGURATION,
  SIDENAV_LAYOUT_CONFIGURATION,
];

export const ROUTES: LayoutConfigurationWithRouteProps[] = CONFIGURATIONS.map(
  (configuration) => {
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
  },
);
