import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { LOGIN_REDIRECT_LINK } from "./constants";

interface PrivateRouteProps extends RouteProps {
  component: React.JSXElementConstructor<any>;
  authentificated: boolean;
}

/* eslint-disable */
const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
  component: Component,
  authentificated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (authentificated) {
        return <Component {...props} />;
      }
      return (
        <Redirect
          to={{
            pathname: LOGIN_REDIRECT_LINK,
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

export default PrivateRoute;
