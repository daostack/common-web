import { ComponentType } from "react";
import { RouteProps } from "react-router";
import { ROUTE_PATHS } from "@/shared/constants";
import { UserRole } from "@/shared/models";

export enum RouteType {
  Public,
  Private,
  OnlyPublic,
}

interface GeneralRouteConfiguration
  extends Pick<RouteProps, "component" | "exact"> {
  path: ROUTE_PATHS;
}

export interface PublicRouteConfiguration extends GeneralRouteConfiguration {
  type?: RouteType.Public;
}

export interface PrivateRouteConfiguration extends GeneralRouteConfiguration {
  type: RouteType.Private;
  /** User should have all of these roles */
  mandatoryRoles?: UserRole[];
  /** User should have one of these roles */
  anyMandatoryRoles?: UserRole[];
  unauthenticatedRedirectPath?: ROUTE_PATHS;
  unauthorizedRedirectPath?: ROUTE_PATHS;
}

export interface OnlyPublicRouteConfiguration
  extends GeneralRouteConfiguration {
  type: RouteType.OnlyPublic;
}

type Route =
  | PublicRouteConfiguration
  | PrivateRouteConfiguration
  | OnlyPublicRouteConfiguration;

export interface LayoutConfiguration {
  component: ComponentType;
  routes: Route[];
}
