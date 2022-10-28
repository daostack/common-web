import { ContactUsContainer, LandingContainer } from "@/containers/Landing";
import { ROUTE_PATHS } from "@/shared/constants";
import { OldLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "./types";

export const ROUTES: LayoutConfiguration[] = [
  {
    component: OldLayout,
    routes: [
      {
        path: ROUTE_PATHS.HOME,
        exact: true,
        component: LandingContainer,
      },
      {
        path: ROUTE_PATHS.CONTACT_US,
        exact: true,
        component: ContactUsContainer,
      },
    ],
  },
];
