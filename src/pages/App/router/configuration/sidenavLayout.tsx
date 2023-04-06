import { CommonPage_v03 } from "@/pages/common-v03";
import { ROUTE_PATHS } from "@/shared/constants";
import { SidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export interface SidenavLayoutRouteOptions {
  sidenav?: boolean;
}

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration<SidenavLayoutRouteOptions> =
  {
    component: SidenavLayout,
    routes: [
      {
        path: ROUTE_PATHS.V03_COMMON,
        exact: true,
        component: CommonPage_v03,
      },
    ],
  };
