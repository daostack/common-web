import React from "react";
import { Route } from "react-router-dom";
import { PrivateRoute } from "@/containers/App/router";
import { ROUTE_PATHS } from "@/shared/constants";
import {
  CommonListContainer,
  CommonDetailContainer,
  SupportersContainer,
} from "..";

export default function CommonContainer() {
  return (
    <div>
      <Route
        path={ROUTE_PATHS.COMMON_DETAIL}
        exact
        component={CommonDetailContainer}
      />
      <PrivateRoute
        path={ROUTE_PATHS.COMMON_LIST}
        exact
        component={CommonListContainer}
      />
      <Route
        path={ROUTE_PATHS.COMMON_SUPPORT}
        exact
        component={SupportersContainer}
      />
    </div>
  );
}
