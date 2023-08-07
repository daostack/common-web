import { EmptyPage } from "@/pages/empty";
import { ROUTE_PATHS } from "@/shared/constants";
import { EmptyLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export const EMPTY_LAYOUT_CONFIGURATION: LayoutConfiguration = {
  component: EmptyLayout,
  routes: [
    {
      path: ROUTE_PATHS.MOBILE_LOADER,
      exact: true,
      component: EmptyPage,
    },
  ],
};
