import CommonPage from "@/pages/common/Common";
import { ROUTE_PATHS, ViewportBreakpointVariant } from "@/shared/constants";
import { SidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export interface SidenavLayoutRouteOptions {
  footer?:
    | boolean
    | {
        displayedOnViewports?: ViewportBreakpointVariant[];
      };
}

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration<SidenavLayoutRouteOptions> =
  {
    component: SidenavLayout,
    routes: [
      {
        path: ROUTE_PATHS.COMMON,
        exact: true,
        component: CommonPage,
        routeOptions: {
          footer: {
            displayedOnViewports: [
              ViewportBreakpointVariant.Desktop,
              ViewportBreakpointVariant.Laptop,
            ],
          },
        },
      },
    ],
  };
