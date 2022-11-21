import React from "react";
import { Common as CommonPage } from "@/pages/common";
import { ROUTE_PATHS } from "@/shared/constants";
import { SidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration = {
  component: SidenavLayout,
  routes: [
    {
      path: ROUTE_PATHS.COMMON,
      exact: true,
      component: CommonPage,
    },
  ],
};
