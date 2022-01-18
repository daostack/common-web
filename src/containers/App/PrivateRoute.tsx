import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

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
            pathname: "/",
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

export default PrivateRoute;
