import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { ROUTE_PATHS } from "../../shared/constants";
import { UserRole } from "../../shared/models";
import {
  checkMandatoryRoles,
  checkAnyMandatoryRoles,
} from "../../shared/utils";

interface PrivateRouteProps extends RouteProps {
  component: React.JSXElementConstructor<any>;
  authenticated: boolean;
  userRoles?: UserRole[];
  /** User should have all of these roles */
  mandatoryRoles?: UserRole[];
  /** User should have one of these roles */
  anyMandatoryRoles?: UserRole[];
  unauthenticatedRedirectPath?: ROUTE_PATHS;
  unauthorizedRedirectPath?: ROUTE_PATHS;
}

const DEFAULT_REDIRECT_PATH = ROUTE_PATHS.HOME;

/* eslint-disable */
const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const {
    component: Component,
    authenticated,
    userRoles,
    mandatoryRoles,
    anyMandatoryRoles,
    unauthenticatedRedirectPath,
    unauthorizedRedirectPath,
    ...rest
  } = props;
  const hasNecessaryRoles =
    (!mandatoryRoles || checkMandatoryRoles(mandatoryRoles, userRoles)) &&
    (!anyMandatoryRoles ||
      checkAnyMandatoryRoles(anyMandatoryRoles, userRoles));

  return (
    <Route
      {...rest}
      render={(props) => {
        const to = {
          pathname:
            (!authenticated
              ? unauthenticatedRedirectPath
              : unauthorizedRedirectPath) || DEFAULT_REDIRECT_PATH,
          state: { from: props.location },
        };

        if (!authenticated || !hasNecessaryRoles) {
          return <Redirect to={to} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
