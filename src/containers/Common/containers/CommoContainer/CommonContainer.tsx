import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import PrivateRoute from "@/containers/App/PrivateRoute";
import { authentificated } from "@/containers/Auth/store/selectors";
import { ROUTE_PATHS } from "@/shared/constants";
import { CommonListContainer, CommonDetailContainer } from "..";

export default function CommonContainer() {
  const isAuthenticated = useSelector(authentificated());

  return (
    <div>
      <Route
        path={ROUTE_PATHS.COMMON_DETAIL}
        exact={true}
        component={CommonDetailContainer}
      />
      <PrivateRoute
        path={ROUTE_PATHS.COMMON_LIST}
        exact={true}
        component={CommonListContainer}
        authenticated={isAuthenticated}
      />
    </div>
  );
}
