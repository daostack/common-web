import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { LoginForm } from "../../components";
import { login } from "../../store/actions";
import { AuthShape } from "../../interface";
import { getLoading } from "../../../../shared/store/selectors";

// TODO add usefull hooks
// TODO sagas mocks

const LoginContainer = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoading());

  const handleSubmit = (values: AuthShape) => {
    dispatch(login.request({ ...values }));
  };

  return (
    <section className="login-container">
      <div className="login-container-title">
        <span>Login</span>
      </div>
      <div className="login-content">
        <LoginForm loading={loading} submitHandler={handleSubmit} />
      </div>
    </section>
  );
};

export default LoginContainer;
