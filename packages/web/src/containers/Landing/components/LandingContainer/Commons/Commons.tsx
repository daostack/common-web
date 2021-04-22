import React from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../../../shared/constants";
import "./index.scss";

export default function Commons() {
  return (
    <div className="commons-wrapper">
      <h1>Featured Commons</h1>
      <span>Browse some of the emerging groups on the Common app</span>
      <Link className="button-blue explore-commons" to={ROUTE_PATHS.COMMON_LIST}>
        Explore all commons
      </Link>
    </div>
  );
}
