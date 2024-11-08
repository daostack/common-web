import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { selectIsAuthenticated } from "@/pages/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";

interface OnlyPublicRouteProps extends RouteProps {
  redirectPath?: ROUTE_PATHS;
}

const DEFAULT_REDIRECT_PATH = ROUTE_PATHS.HOME;

const OnlyPublicRoute: FC<OnlyPublicRouteProps> = (props) => {
  const { component: Component, redirectPath, children, ...rest } = props;
  const authenticated = useSelector(selectIsAuthenticated());

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authenticated) {
          return Component ? <Component {...props} /> : children;
        }

        return (
          <Redirect
            to={{
              pathname: redirectPath || DEFAULT_REDIRECT_PATH,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default OnlyPublicRoute;
