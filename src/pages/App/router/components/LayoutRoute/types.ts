import { ReactNode } from "react";
import { RouteComponentProps, RouteProps } from "react-router-dom";
import { UserRole } from "@/shared/models";
import { Route } from "../../types";

export interface RenderFunctionOptions<T extends Route = Route>
  extends Pick<RouteProps, "component" | "children">,
    RouteComponentProps {
  configuration: T;
  userRoles?: UserRole[];
  authenticated: boolean;
}

export type RenderRouteContentFunction<T extends Route = Route> = (
  props: RenderFunctionOptions<T>,
) => ReactNode;
