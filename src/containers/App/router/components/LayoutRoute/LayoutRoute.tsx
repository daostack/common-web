import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Route, RouteProps } from "react-router-dom";
import { Route as RouteConfiguration } from "@/containers/App/router/types";
import {
  authentificated,
  selectUserRoles,
} from "@/containers/Auth/store/selectors";
import { renderRouteContent } from "./helpers";

interface PrivateRouteProps extends RouteProps {
  routeConfiguration: RouteConfiguration;
}

const LayoutRoute: FC<PrivateRouteProps> = (props) => {
  const { routeConfiguration, component, children, ...restProps } = props;
  const userRoles = useSelector(selectUserRoles());
  const authenticated = useSelector(authentificated());

  return (
    <Route
      {...restProps}
      render={(routeProps) =>
        renderRouteContent({
          ...routeProps,
          component,
          children,
          configuration: routeConfiguration,
          userRoles: userRoles || [],
          authenticated,
        })
      }
    />
  );
};

export default LayoutRoute;
