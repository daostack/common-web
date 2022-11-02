import React from "react";
import PropTypes from "prop-types";

const AuthWrapper: React.FunctionComponent = ({ children }) => (
  <div>{children}</div>
);

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

AuthWrapper.defaultProps = {
  children: <p />,
};

export default AuthWrapper;
