import { ComponentType } from "react";
import { RouteProps } from "react-router";
import { ROUTE_PATHS } from "@/shared/constants";
import { UserRole } from "@/shared/models";

type DefaultRouteOptions = unknown;

export enum RouteType {
  Public,
  Private,
  OnlyPublic,
}

interface GeneralRouteConfiguration<
  RouteOptions extends DefaultRouteOptions = DefaultRouteOptions,
> extends Pick<RouteProps, "component" | "exact"> {
  path: ROUTE_PATHS;
  routeOptions?: RouteOptions;
}

export interface PublicRouteConfiguration<
  RouteOptions extends DefaultRouteOptions = DefaultRouteOptions,
> extends GeneralRouteConfiguration<RouteOptions> {
  type?: RouteType.Public;
}

export interface PrivateRouteConfiguration<
  RouteOptions extends DefaultRouteOptions = DefaultRouteOptions,
> extends GeneralRouteConfiguration<RouteOptions> {
  type: RouteType.Private;
  /** User should have all of these roles */
  mandatoryRoles?: UserRole[];
  /** User should have one of these roles */
  anyMandatoryRoles?: UserRole[];
  unauthenticatedRedirectPath?: ROUTE_PATHS;
  unauthorizedRedirectPath?: ROUTE_PATHS;
}

export interface OnlyPublicRouteConfiguration<
  RouteOptions extends DefaultRouteOptions = DefaultRouteOptions,
> extends GeneralRouteConfiguration<RouteOptions> {
  type: RouteType.OnlyPublic;
  redirectPath?: ROUTE_PATHS;
}

export type Route<
  RouteOptions extends DefaultRouteOptions = DefaultRouteOptions,
> =
  | PublicRouteConfiguration<RouteOptions>
  | PrivateRouteConfiguration<RouteOptions>
  | OnlyPublicRouteConfiguration<RouteOptions>;

export interface LayoutConfiguration<
  RouteOptions extends DefaultRouteOptions = DefaultRouteOptions,
> {
  component: ComponentType;
  routes: Route<RouteOptions>[];
}

export interface LayoutConfigurationWithRouteProps<
  RouteOptions extends DefaultRouteOptions = DefaultRouteOptions,
> extends LayoutConfiguration<RouteOptions>,
    Pick<RouteProps<ROUTE_PATHS>, "path"> {
  exact: true;
}
