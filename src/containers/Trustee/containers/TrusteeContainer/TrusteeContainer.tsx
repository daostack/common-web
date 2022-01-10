import React, { FC } from "react";
import { Route } from "react-router-dom";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { AuthenticationContainer } from "../AuthenticationContainer";

const TrusteeContainer: FC = () => {
  return (
    <>
      <Route
        path={ROUTE_PATHS.TRUSTEE_AUTH}
        exact
        component={AuthenticationContainer}
      />
    </>
  );
};

export default TrusteeContainer;
