import React, { FC } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { ROUTE_PATHS } from "../../shared/constants";

interface OnlyPublicRouteProps extends RouteProps {
  component: React.JSXElementConstructor<any>;
  authenticated: boolean;
  redirectPath?: ROUTE_PATHS;
}

const DEFAULT_REDIRECT_PATH = ROUTE_PATHS.HOME;

const OnlyPublicRoute: FC<OnlyPublicRouteProps> = (props) => {
  const { component: Component, authenticated, redirectPath, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authenticated) {
          return <Component {...props} />;
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
