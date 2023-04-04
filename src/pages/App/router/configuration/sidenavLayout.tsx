import { SidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export interface SidenavLayoutRouteOptions {
  sidenav?: boolean;
}

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration<SidenavLayoutRouteOptions> =
  {
    component: SidenavLayout,
    routes: [],
  };
