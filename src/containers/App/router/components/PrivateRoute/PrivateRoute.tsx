import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, RouteProps } from "react-router-dom";
import {
  authentificated,
  selectUserRoles,
} from "@/containers/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";
import { checkMandatoryRoles, checkAnyMandatoryRoles } from "@/shared/utils";
import { PrivateRouteConfiguration } from "../../types";

type PrivateRouteProps = RouteProps &
  Pick<
    PrivateRouteConfiguration,
    | "mandatoryRoles"
    | "anyMandatoryRoles"
    | "unauthenticatedRedirectPath"
    | "unauthorizedRedirectPath"
  >;

const DEFAULT_REDIRECT_PATH = ROUTE_PATHS.HOME;

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const {
    component: Component,
    mandatoryRoles,
    anyMandatoryRoles,
    unauthenticatedRedirectPath,
    unauthorizedRedirectPath,
    children,
    ...rest
  } = props;
  const userRoles = useSelector(selectUserRoles());
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
