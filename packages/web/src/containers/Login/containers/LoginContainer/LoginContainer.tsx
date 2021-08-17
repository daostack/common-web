import React from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../../../Auth/store/selectors";
import { Connect } from "../../components/LoginContainer/Connect";
import { UserDetails } from "../../components/LoginContainer/UserDetails";
import "./index.scss";

const LoginContainer = () => {
  const user = useSelector(selectUser());

  return <div className="login-wrapper">{user ? <UserDetails user={user} /> : <Connect />}</div>;
};

export default LoginContainer;
