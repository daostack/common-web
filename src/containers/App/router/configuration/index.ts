import { mapRoutesToPaths } from "../helpers";
import {
  LayoutConfiguration,
  LayoutConfigurationWithRouteProps,
} from "../types";
import { OLD_LAYOUT_CONFIGURATION } from "./oldLayout";

const CONFIGURATIONS: LayoutConfiguration[] = [OLD_LAYOUT_CONFIGURATION];

export const ROUTES: LayoutConfigurationWithRouteProps[] = CONFIGURATIONS.map(
  (configuration) => ({
    ...configuration,
    path: mapRoutesToPaths(configuration.routes),
    exact: true,
  }),
);
