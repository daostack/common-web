import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Route, RouteProps } from "react-router-dom";
import { Route as RouteConfiguration } from "@/pages/App/router/types";
import { authentificated, selectUserRoles } from "@/pages/Auth/store/selectors";
import { matchRoute } from "@/shared/utils";
import { renderRouteContent } from "./helpers";

interface PrivateRouteProps extends RouteProps {
  routeConfigurations: RouteConfiguration[];
}

const LayoutRoute: FC<PrivateRouteProps> = (props) => {
  const { routeConfigurations, component, children, ...restProps } = props;
  const userRoles = useSelector(selectUserRoles());
  const authenticated = useSelector(authentificated());
  const pathname = restProps.location?.pathname || "";
  const routeConfiguration = routeConfigurations.find((configuration) =>
    matchRoute(pathname, configuration.path, { exact: configuration.exact }),
  );

  if (!routeConfiguration) {
    console.error(`There is no specified route for path: "${pathname}"`);
    return null;
  }

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
