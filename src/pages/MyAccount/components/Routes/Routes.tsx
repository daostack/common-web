import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import "./index.scss";

export default function Routes() {
  const routesGenerator = useRoutesContext(false);

  return (
    <div className="routes-wrapper">
      <NavLink
        to={routesGenerator?.getProfilePagePath() || ROUTE_PATHS.PROFILE}
        activeClassName="active"
      >
        Profile
      </NavLink>
      <NavLink to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES} activeClassName="active">
        Activities
      </NavLink>
      <NavLink
        to={routesGenerator?.getBillingPagePath() || ROUTE_PATHS.BILLING}
        activeClassName="active"
      >
        Billing
      </NavLink>
    </div>
  );
}
