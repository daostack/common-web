import React from "react";
import "../../../containers/LoginContainer/index.scss";
import "./index.scss";

const LoginError = () => {
  return (
    <div className="login-error">
      There was an error logging you in. Please try again or try connecting a
      different account.
    </div>
  );
};

export default LoginError;
