import { ComponentType } from "react";
import { RouteProps } from "react-router";
import { ROUTE_PATHS } from "src/shared/constants";

enum RouteType {
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
