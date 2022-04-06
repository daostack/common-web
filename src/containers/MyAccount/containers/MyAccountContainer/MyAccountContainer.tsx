import React from "react";
import { useSelector } from "react-redux";
import { getScreenSize } from "@/shared/store/selectors";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import PrivateRoute from "@/containers/App/PrivateRoute";
import { authentificated } from "@/containers/Auth/store/selectors";
import { Sidebar } from "../../components/Sidebar";
import { Profile } from "../../components/Profile";
import { Activities } from "../../components/Activities";
import "./index.scss";

export default function MyAccountContainer() {
  const screenSize = useSelector(getScreenSize());
  const isAuthenticated = useSelector(authentificated());

  return (
    <div className="my-account-container-wrapper">
      {screenSize === ScreenSize.Desktop && <Sidebar />}
      <PrivateRoute
        path={ROUTE_PATHS.MY_ACCOUNT_PROFILE}
        exact
        component={Profile}
        authenticated={isAuthenticated}
      />
      <PrivateRoute
        path={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}
        exact
        component={Activities}
        authenticated={isAuthenticated}
      />
    </div>
  )
}
