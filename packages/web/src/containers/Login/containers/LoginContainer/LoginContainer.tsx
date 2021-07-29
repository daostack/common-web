import React from "react";
import { useSelector } from "react-redux";
import { authentificated } from "../../../Auth/store/selectors";
import { Connect } from "../../components/LoginContainer/Connect";
import { Details } from "../../components/LoginContainer/Details";
import "./index.scss";

const LoginContainer = () => {
  const isAuthorized = useSelector(authentificated());

  return <div className="login-wrapper">{isAuthorized ? <Details /> : <Connect />}</div>;
};

export default LoginContainer;
