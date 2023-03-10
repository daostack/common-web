import CommonPage from "@/pages/common/Common";
import { ROUTE_PATHS } from "@/shared/constants";
import { CommonSidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export interface CommonSidenavLayoutRouteOptions {
  sidenav?: boolean;
}

export const COMMON_SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration<CommonSidenavLayoutRouteOptions> =
  {
    component: CommonSidenavLayout,
    routes: [
      {
        path: ROUTE_PATHS.TEST,
        exact: true,
        component: CommonPage,
      },
    ],
  };
