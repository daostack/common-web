import React, { useEffect } from "react";
import { push } from "connected-react-router";
import { useSelector, useDispatch } from "react-redux";
import { Route } from "react-router-dom";

import { AuthWrapper } from "../../components";
import { LoginContainer, RegistrationContainer } from "../";
import { authentificated } from "../../store/selectors";

const AuthContainer = () => {
  const isAuthorized = useSelector(authentificated());

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthorized) {
      dispatch(push("/"));
    }
  }, [isAuthorized, dispatch]);

  return (
    <AuthWrapper>
      <Route path="/auth/" exact component={LoginContainer} />
      <Route path="/auth/signup" component={RegistrationContainer} />
    </AuthWrapper>
  );
};

export default AuthContainer;
