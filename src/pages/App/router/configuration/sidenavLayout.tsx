import React from "react";
import { CommonDetailContainer } from "@/pages/OldCommon";
import { Common as CommonPage } from "@/pages/common";
import { ROUTE_PATHS } from "@/shared/constants";
import { SidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export type SidenavLayoutRouteOptions = unknown;

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration<SidenavLayoutRouteOptions> =
  {
    component: SidenavLayout,
    routes: [
      {
        path: ROUTE_PATHS.COMMON,
        exact: true,
        component: CommonPage,
      },
      {
        path: ROUTE_PATHS.COMMON_DETAIL,
        exact: true,
        component: CommonDetailContainer,
      },
    ],
  };
