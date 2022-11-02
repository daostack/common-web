import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import "./index.scss";

export default function Routes() {
  return (
    <div className="routes-wrapper">
      <NavLink to={ROUTE_PATHS.MY_ACCOUNT_PROFILE} activeClassName="active">
        Profile
      </NavLink>
      <NavLink to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES} activeClassName="active">
        Activities
      </NavLink>
      <NavLink to={ROUTE_PATHS.MY_ACCOUNT_BILLING} activeClassName="active">
        Billing
      </NavLink>
    </div>
  );
}
