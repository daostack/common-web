import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import classNames from "classnames";

const Content: React.FunctionComponent = ({ children }) => {
  const location = useLocation();
  const contentWrapperClassName = classNames({
    "content-wrapper": true,
    "landing-page": location.pathname !== "/",
  });
  return <div className={contentWrapperClassName}>{children}</div>;
};

Content.propTypes = {
  children: PropTypes.node,
};

Content.defaultProps = {
  children: <p />,
};

export default Content;
