import React from "react";
import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  to: string;
};

const RedirectLink: React.FunctionComponent<Props> = ({ children, to }) => (
  <div>
    <Link to={to}>{children}</Link>
  </div>
);

export default RedirectLink;
