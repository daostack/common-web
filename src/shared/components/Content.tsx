import React from "react";
import PropTypes from "prop-types";

const Content: React.FunctionComponent = ({ children }) => {
  return <div className="content-wrapper">{children}</div>;
};

Content.propTypes = {
  children: PropTypes.node,
};

Content.defaultProps = {
  children: <p />,
};

export default Content;
