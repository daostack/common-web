import React, { useContext } from "react";
import { Route } from "../../types";

export type LayoutRouteContextValue = Pick<Route, "routeOptions">;

export const LayoutRouteContext = React.createContext<LayoutRouteContextValue>(
  {},
);

export const useLayoutRouteContext = (): LayoutRouteContextValue =>
  useContext(LayoutRouteContext);
