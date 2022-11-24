import React, { useContext } from "react";
import { Route } from "../../types";

export interface LayoutRouteContextValue<RouteOptions = Route["routeOptions"]> {
  routeOptions?: RouteOptions;
}

export const LayoutRouteContext = React.createContext<LayoutRouteContextValue>(
  {},
);

export const useLayoutRouteContext = <
  RouteOptions = Route["routeOptions"],
>(): LayoutRouteContextValue<RouteOptions> => {
  // @ts-ignore
  return useContext(LayoutRouteContext);
};
