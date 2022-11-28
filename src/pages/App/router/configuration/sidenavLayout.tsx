import React from "react";
import { Common as CommonPage } from "@/pages/common";
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
      },
    ],
  };
