import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { ROUTE_PATHS } from "../../shared/constants";

interface PrivateRouteProps extends RouteProps {
  component: React.JSXElementConstructor<any>;
  authenticated: boolean;
}

/* eslint-disable */
const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  authenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (authenticated) {
        return <Component {...props} />;
      }

      return (
        <Redirect
          to={{
            pathname: ROUTE_PATHS.COMMON_LIST,
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

export default PrivateRoute;
