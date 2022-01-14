import React, { FC } from "react";
import { Route } from "react-router-dom";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { AuthenticationContainer } from "../AuthenticationContainer";
import { InvoiceAcceptanceContainer } from "../InvoiceAcceptanceContainer";
import { InvoicesAcceptanceContainer } from "../InvoicesAcceptanceContainer";

const TrusteeContainer: FC = () => {
  return (
    <>
      <Route
        path={ROUTE_PATHS.TRUSTEE_AUTH}
        exact
        component={AuthenticationContainer}
      />
      <Route
        path={ROUTE_PATHS.TRUSTEE_INVOICE}
        exact
        component={InvoiceAcceptanceContainer}
      />
      <Route
        path={ROUTE_PATHS.TRUSTEE_INVOICES}
        exact
        component={InvoicesAcceptanceContainer}
      />
    </>
  );
};

export default TrusteeContainer;
