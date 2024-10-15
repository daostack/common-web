import React, { lazy } from "react";
import { ROUTE_PATHS } from "@/shared/constants";
import { SidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

const CommonPage_v03 = lazy(() => import("@/pages/common-v03").then(module => ({ default: module.CommonPage_v03 })));

export interface SidenavLayoutRouteOptions {
  sidenav?: boolean;
}

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration = {
  component: SidenavLayout,
  routes: [
    {
      path: ROUTE_PATHS.V03_COMMON,
      exact: true,
      component: CommonPage_v03,
    },
  ],
};
