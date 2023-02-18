import CommonPage from "@/pages/common/Common";
import { CommonCreationPage } from "@/pages/commonCreation";
import { CommonEditingPage } from "@/pages/commonEditing";
import { ProfilePage } from "@/pages/profile";
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
        path: ROUTE_PATHS.COMMON,
        exact: true,
        component: CommonPage,
      },
      {
        path: ROUTE_PATHS.PROJECT_CREATION,
        exact: true,
        component: CommonCreationPage,
      },
      {
        path: ROUTE_PATHS.COMMON_EDITING,
        exact: true,
        component: CommonEditingPage,
      },
      {
        path: ROUTE_PATHS.PROFILE,
        exact: true,
        component: ProfilePage,
      },
    ],
  };
