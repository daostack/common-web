import React, { FC } from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { UserRole } from "../../../../shared/models";
import OnlyPublicRoute from "../../../App/OnlyPublicRoute";
import PrivateRoute from "../../../App/PrivateRoute";
import { authentificated, selectUser } from "../../../Auth/store/selectors";
import { AuthenticationContainer } from "../AuthenticationContainer";
import { InvoiceAcceptanceContainer } from "../InvoiceAcceptanceContainer";
import { InvoicesAcceptanceContainer } from "../InvoicesAcceptanceContainer";

const TrusteeContainer: FC = () => {
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const generalPrivateProps = {
    authenticated: isAuthenticated,
    userRoles: user?.roles,
    anyMandatoryRoles: [UserRole.Trustee],
    unauthenticatedRedirectPath: ROUTE_PATHS.TRUSTEE_AUTH,
  };

  return (
    <>
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
      <Redirect to={ROUTE_PATHS.TRUSTEE_AUTH} />
    </>
  );
};

export default TrusteeContainer;
