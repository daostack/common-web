import React from "react";
import PropTypes from "prop-types";

const Input: React.FunctionComponent<React.HTMLProps<HTMLInputElement>> = (props) => {
  return <input {...props} />;
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
};

Input.defaultProps = {
  label: "",
  type: "text",
  name: "",
};

export default Input;
