import { ComponentType } from "react";
import { RouteProps } from "react-router";
import { ROUTE_PATHS } from "src/shared/constants";

export interface AppRoute extends Pick<RouteProps, "component" | "exact"> {
  path: ROUTE_PATHS;
  isPrivate?: boolean;
}

export interface LayoutConfiguration {
  component: ComponentType;
  routes: AppRoute[];
}
