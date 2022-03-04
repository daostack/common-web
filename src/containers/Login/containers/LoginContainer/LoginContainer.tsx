import React, { useCallback, useEffect, useMemo, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserDetails } from "../../components/LoginContainer/UserDetails";
import { Modal } from "../../../../shared/components";
import { AuthProvider } from "../../../../shared/constants";
import {
  setIsLoginModalShowing,
  socialLogin,
} from "../../../Auth/store/actions";
import { Connect } from "../../components/LoginContainer/Connect";
import { PhoneAuth } from "../../components/LoginContainer/PhoneAuth";
import { AuthStage } from "../../components/LoginContainer/constants";
import {
  selectIsLoginModalShowing,
  selectIsNewUser,
  selectUser,
} from "../../../Auth/store/selectors";
import "./index.scss";

const LoginContainer: FC = () => {
  const [stage, setStage] = useState(AuthStage.AuthMethodSelect);
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const isNewUser = useSelector(selectIsNewUser());
  const isShowing = useSelector(selectIsLoginModalShowing());

  const handleAuthButtonClick = useCallback(
    (provider: AuthProvider) => {
      if (provider === AuthProvider.Phone) {
        setStage(AuthStage.PhoneAuth);
        return;
      }

      dispatch(socialLogin.request(provider));
    },
    [dispatch]
  );

  const handleClose = useCallback(() => {
    dispatch(setIsLoginModalShowing(false));
  }, [dispatch]);

  useEffect(() => {
    if (!isShowing) {
      setStage(AuthStage.AuthMethodSelect);
    }
  }, [isShowing]);

  useEffect(() => {
    if (!isNewUser && user && isShowing) {
      handleClose();
    }
  }, [isNewUser, user, isShowing, handleClose]);

  const content = useMemo(() => {
    switch (stage) {
      case AuthStage.AuthMethodSelect:
        return <Connect onAuthButtonClick={handleAuthButtonClick} />;
      case AuthStage.PhoneAuth:
        return <PhoneAuth setStage={setStage} />;
      case AuthStage.CompleteAccountDetails:
        return user ? (
          <UserDetails user={user} closeModal={handleClose} />
        ) : null;
      default:
        return null;
    }
  }, [stage, handleClose, user, handleAuthButtonClick]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={handleClose}
      className="mobile-full-screen"
      mobileFullScreen
    >
      {content}
    </Modal>
  );
};

export default LoginContainer;
