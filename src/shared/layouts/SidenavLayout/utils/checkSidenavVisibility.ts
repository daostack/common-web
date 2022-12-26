import { SidenavLayoutRouteOptions } from "@/pages/App/router";

export const checkSidenavVisibility = (
  sidenavOptions: SidenavLayoutRouteOptions["sidenav"],
): boolean => sidenavOptions ?? true;
