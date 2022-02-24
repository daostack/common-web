import React, { FC } from "react";
import "./index.scss";

const NotFound: FC = () => (
  <div className="page-not-found">
    <span className="page-not-found__code">404</span>
    <h3 className="page-not-found__message">This page could not be found.</h3>
  </div>
);

export default NotFound;
