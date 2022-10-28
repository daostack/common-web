import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { authentificated } from "@/containers/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";
import { UserRole } from "@/shared/models";
import { checkMandatoryRoles, checkAnyMandatoryRoles } from "@/shared/utils";
import { PrivateRouteConfiguration } from "./router/types";

interface PrivateRouteProps
  extends RouteProps,
    Pick<
      PrivateRouteConfiguration,
      | "mandatoryRoles"
      | "anyMandatoryRoles"
      | "unauthenticatedRedirectPath"
      | "unauthorizedRedirectPath"
    > {
  userRoles?: UserRole[];
}

const DEFAULT_REDIRECT_PATH = ROUTE_PATHS.HOME;

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const {
    component: Component,
    userRoles,
    mandatoryRoles,
    anyMandatoryRoles,
    unauthenticatedRedirectPath,
    unauthorizedRedirectPath,
    children,
    ...rest
  } = props;
  const authenticated = useSelector(authentificated());
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

        return Component ? <Component {...props} /> : children;
      }}
    />
  );
};

export default PrivateRoute;
