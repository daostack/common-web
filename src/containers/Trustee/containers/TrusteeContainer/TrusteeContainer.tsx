import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Redirect, RouteProps } from "react-router-dom";
import OnlyPublicRoute from "@/containers/App/OnlyPublicRoute";
import PrivateRoute from "@/containers/App/PrivateRoute";
import { authentificated, selectUser } from "@/containers/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";
import { useMatchRoute } from "@/shared/hooks";
import { UserRole } from "@/shared/models";
import { AuthenticationContainer } from "../AuthenticationContainer";
import { InvoiceAcceptanceContainer } from "../InvoiceAcceptanceContainer";
import { InvoicesAcceptanceContainer } from "../InvoicesAcceptanceContainer";

const TRUSTEE_MATCH_ROUTE_PROPS: RouteProps = {
  exact: true,
};

const TrusteeContainer: FC = () => {
  const isParentTrusteeRoute = useMatchRoute(
    ROUTE_PATHS.TRUSTEE,
    TRUSTEE_MATCH_ROUTE_PROPS,
  );
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const generalPrivateProps = {
    userRoles: user?.roles,
    anyMandatoryRoles: [UserRole.Trustee],
    unauthenticatedRedirectPath: ROUTE_PATHS.TRUSTEE_AUTH,
  };

  return (
    <>
      {isParentTrusteeRoute && <Redirect to={ROUTE_PATHS.TRUSTEE_AUTH} />}
      <OnlyPublicRoute
        path={ROUTE_PATHS.TRUSTEE_AUTH}
        exact
        component={AuthenticationContainer}
        authenticated={isAuthenticated}
        redirectPath={ROUTE_PATHS.TRUSTEE_INVOICES}
      />
      <PrivateRoute
        path={ROUTE_PATHS.TRUSTEE_INVOICE}
        exact
        component={InvoiceAcceptanceContainer}
        {...generalPrivateProps}
      />
      <PrivateRoute
        path={ROUTE_PATHS.TRUSTEE_INVOICES}
        exact
        component={InvoicesAcceptanceContainer}
        {...generalPrivateProps}
      />
    </>
  );
};

export default TrusteeContainer;
