import React from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../../../Auth/store/selectors";
import { Connect } from "../../components/LoginContainer/Connect";
import { UserDetails } from "../../components/LoginContainer/UserDetails";
import "./index.scss";

interface LoginContainerProps {
  closeModal: () => void;
}

const LoginContainer = ({ closeModal }: LoginContainerProps) => {
  const user = useSelector(selectUser());

  return (
    <div className="login-wrapper">
      {user ? <UserDetails user={user} closeModal={closeModal} /> : <Connect />}
    </div>
  );
};

export default LoginContainer;
