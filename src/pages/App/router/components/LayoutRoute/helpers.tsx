import React, { ReactNode } from "react";
import { Redirect } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import { checkAnyMandatoryRoles, checkMandatoryRoles } from "@/shared/utils";
import {
  OnlyPublicRouteConfiguration,
  PrivateRouteConfiguration,
  PublicRouteConfiguration,
  RouteType,
} from "../../types";
import { RenderFunctionOptions, RenderRouteContentFunction } from "./types";

const DEFAULT_REDIRECT_PATH = ROUTE_PATHS.HOME;

const renderDefaultContent = (props: RenderFunctionOptions) => {
  const { component: Component, children, ...restOptions } = props;

  return Component ? <Component {...restOptions} /> : children;
};

const renderPublicRouteContent: RenderRouteContentFunction<
  PublicRouteConfiguration
> = (props): ReactNode => renderDefaultContent(props);

const renderPrivateRouteContent: RenderRouteContentFunction<
  PrivateRouteConfiguration
> = (props): ReactNode => {
  const { configuration, userRoles, authenticated } = props;
  const {
    mandatoryRoles,
    anyMandatoryRoles,
    unauthenticatedRedirectPath,
    unauthorizedRedirectPath,
  } = configuration;
  const hasNecessaryRoles =
    (!mandatoryRoles || checkMandatoryRoles(mandatoryRoles, userRoles)) &&
    (!anyMandatoryRoles ||
      checkAnyMandatoryRoles(anyMandatoryRoles, userRoles));

  if (authenticated && hasNecessaryRoles) {
    return renderDefaultContent(props);
  }

  const to = {
    pathname:
      (!authenticated
        ? unauthenticatedRedirectPath
        : unauthorizedRedirectPath) || DEFAULT_REDIRECT_PATH,
    state: { from: props.location },
  };

  return <Redirect to={to} />;
};

const renderOnlyPublicRouteContent: RenderRouteContentFunction<
  OnlyPublicRouteConfiguration
> = (props): ReactNode => {
  const { configuration, authenticated } = props;
  const { redirectPath = DEFAULT_REDIRECT_PATH } = configuration;

  if (!authenticated) {
    return renderDefaultContent(props);
  }

  return (
    <Redirect
      to={{
        pathname: redirectPath,
        state: { from: props.location },
      }}
    />
  );
};

export const renderRouteContent: RenderRouteContentFunction = (props) => {
  const { configuration } = props;

  switch (configuration.type) {
    case RouteType.Private:
      return renderPrivateRouteContent({ ...props, configuration });
    case RouteType.OnlyPublic:
      return renderOnlyPublicRouteContent({ ...props, configuration });
    case RouteType.Public:
    default:
      return renderPublicRouteContent({ ...props, configuration });
  }
};
