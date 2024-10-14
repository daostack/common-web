import React, { FC, Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, RouteProps } from "react-router-dom";
import { Route as RouteConfiguration } from "@/pages/App/router/types";
import {
  selectIsAuthenticated,
  selectUserRoles,
} from "@/pages/Auth/store/selectors";
import { matchRoute } from "@/shared/utils";
import { LayoutRouteContext, LayoutRouteContextValue } from "./context";
import { renderRouteContent } from "./helpers";
import { SuspenseLoader } from "@/shared/ui-kit";

interface PrivateRouteProps extends RouteProps {
  routeConfigurations: RouteConfiguration[];
}

const LayoutRoute: FC<PrivateRouteProps> = (props) => {
  const { routeConfigurations, component, children, ...restProps } = props;
  const userRoles = useSelector(selectUserRoles());
  const authenticated = useSelector(selectIsAuthenticated());
  const pathname = restProps.location?.pathname || "";
  const routeConfiguration = routeConfigurations.find((configuration) =>
    matchRoute(pathname, configuration.path, { exact: configuration.exact }),
  );
  const contextValue: LayoutRouteContextValue = useMemo(
    () => ({
      routeOptions: routeConfiguration?.routeOptions,
    }),
    [routeConfiguration?.routeOptions],
  );

  if (!routeConfiguration) {
    console.error(`There is no specified route for path: "${pathname}"`);
    return null;
  }

  return (
    <LayoutRouteContext.Provider value={contextValue}>
          <Suspense fallback={SuspenseLoader}>
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
      </Suspense>
    </LayoutRouteContext.Provider>
  );
};

export default LayoutRoute;
