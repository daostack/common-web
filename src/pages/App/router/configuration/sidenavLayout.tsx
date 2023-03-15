import { BillingPage } from "@/pages/billing";
import CommonPage from "@/pages/common/Common";
import { CommonCreationPage } from "@/pages/commonCreation";
import { CommonEditingPage } from "@/pages/commonEditing";
import { ProfilePage } from "@/pages/profile";
import { ROUTE_PATHS } from "@/shared/constants";
import { SidenavLayout } from "@/shared/layouts";
import { ALL_COMMON_PAGE_TABS } from "../../../common";
import { LayoutConfiguration } from "../types";

export interface SidenavLayoutRouteOptions {
  sidenav?: boolean;
}

const getCommonPageConfiguration =
  (): LayoutConfiguration<SidenavLayoutRouteOptions>["routes"] =>
    ALL_COMMON_PAGE_TABS.map((tab) => ({
      path: `${ROUTE_PATHS.COMMON}/${tab}` as ROUTE_PATHS,
      exact: true,
      component: CommonPage,
    }));

export const SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration<SidenavLayoutRouteOptions> =
  {
    component: SidenavLayout,
    routes: [
      ...getCommonPageConfiguration(),
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
      {
        path: ROUTE_PATHS.BILLING,
        exact: true,
        component: BillingPage,
      },
    ],
  };
