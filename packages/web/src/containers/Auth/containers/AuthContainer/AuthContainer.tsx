import React, { useEffect } from "react";
import { push } from "connected-react-router";
import { useSelector, useDispatch } from "react-redux";

import { authentificated } from "../../store/selectors";
import firebase from "../../../../shared/utils/firebase";
import SocialLoginButton from "../../../../shared/components/SocialLogin";
import { AuthWrapper } from "./styles";
import { GoogleAuthInterface } from "../../interface";
import { googleSignIn } from "../../store/actions";

const AuthContainer = () => {
  const isAuthorized = useSelector(authentificated());

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthorized) {
      dispatch(push("/"));
    }
  }, [isAuthorized, dispatch]);

  useEffect(() => {
    (async () => {
      const data = await firebase.firestore().collection("users").get();
      const users = data.docs.map((u) => u.data());
      console.log(users);
    })();
  }, []);

  const onSocialLoginSuccess = (data: GoogleAuthInterface) => {
    dispatch(googleSignIn.request(data));
  };

  const onSocialLoginFailure = (error: Error) => {
    console.log(error);
    // TODO : add notifications
  };

  return (
    <AuthWrapper>
      <div className="inner-wrapper">
        <div className="button-wrapper">
          <SocialLoginButton
            provider="google"
            text="Continue with Google"
            onSuccess={onSocialLoginSuccess}
            onFailure={onSocialLoginFailure}
          />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default AuthContainer;
