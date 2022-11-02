import React from "react";
import { useSelector } from "react-redux";
import { PrivateRoute } from "@/pages/App/router";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { Activities } from "../../components/Activities";
import {
  ActivitiesProposalsContainer,
  ActivitiesCommonsContainer,
} from "../../components/Activities";
import { Billing } from "../../components/Billing";
import { Profile } from "../../components/Profile";
import { Sidebar } from "../../components/Sidebar";
import "./index.scss";

export default function MyAccountContainer() {
  const screenSize = useSelector(getScreenSize());

  return (
    <div className="my-account-container-wrapper">
      {screenSize === ScreenSize.Desktop && <Sidebar />}
      <PrivateRoute
        path={ROUTE_PATHS.MY_ACCOUNT_PROFILE}
        exact
        component={Profile}
      />
      <PrivateRoute
        path={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}
        exact
        component={Activities}
      />
      <PrivateRoute
        path={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_COMMONS}
        exact
        component={ActivitiesCommonsContainer}
      />
      <PrivateRoute
        path={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES_PROPOSALS}
        exact
        component={ActivitiesProposalsContainer}
      />
      <PrivateRoute
        path={ROUTE_PATHS.MY_ACCOUNT_BILLING}
        exact
        component={Billing}
      />
    </div>
  );
}
