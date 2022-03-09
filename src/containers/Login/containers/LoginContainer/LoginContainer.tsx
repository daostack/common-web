import React, { useCallback, useEffect, useMemo, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserDetails } from "../../components/LoginContainer/UserDetails";
import { Modal } from "../../../../shared/components";
import { AuthProvider } from "../../../../shared/constants";
import { getLoading } from "../../../../shared/store/selectors";
import { isFirebaseError } from "../../../../shared/utils/firebase";
import {
  setIsLoginModalShowing,
  socialLogin,
} from "../../../Auth/store/actions";
import {
  selectIsLoginModalShowing,
  selectUser,
} from "../../../Auth/store/selectors";
import { Connect } from "../../components/LoginContainer/Connect";
import { PhoneAuth } from "../../components/LoginContainer/PhoneAuth";
import { AuthStage } from "../../components/LoginContainer/constants";
import "./index.scss";

const LoginContainer: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getLoading());
  const user = useSelector(selectUser());
  const [stage, setStage] = useState(
    user ? AuthStage.CompleteAccountDetails : AuthStage.AuthMethodSelect
  );
  const [hasError, setHasError] = useState(false);
  const isShowing = useSelector(selectIsLoginModalShowing());
  const shouldShowBackButton = stage === AuthStage.PhoneAuth && !isLoading;

  const handleClose = useCallback(() => {
    dispatch(setIsLoginModalShowing(false));
  }, [dispatch]);

  const handleError = useCallback(() => {
    setHasError(true);
    setStage(AuthStage.AuthMethodSelect);
  }, []);

  const handleAuthButtonClick = useCallback(
    (provider: AuthProvider) => {
      setHasError(false);

      if (provider === AuthProvider.Phone) {
        setStage(AuthStage.PhoneAuth);
        return;
      }

      dispatch(
        socialLogin.request({
          payload: provider,
          callback: (error, data) => {
            if (error) {
              if (
                !isFirebaseError(error) ||
                error.code !== "auth/popup-closed-by-user"
              ) {
                handleError();
              }

              return;
            }

            if (data?.isNewUser) {
              setStage(AuthStage.CompleteAccountDetails);
            } else {
              handleClose();
            }
          },
        })
      );
    },
    [dispatch, handleClose, handleError]
  );

  const handleGoBack = useCallback(() => {
    setStage((stage) =>
      stage === AuthStage.PhoneAuth ? AuthStage.AuthMethodSelect : stage - 1
    );
  }, []);

  const handlePhoneStageFinish = useCallback(() => {
    setStage(AuthStage.CompleteAccountDetails);
  }, []);

  useEffect(() => {
    if (!isShowing) {
      setStage(
        user ? AuthStage.CompleteAccountDetails : AuthStage.AuthMethodSelect
      );
    }
  }, [isShowing, user]);

  const content = useMemo(() => {
    switch (stage) {
      case AuthStage.AuthMethodSelect:
        return (
          <Connect
            hasError={hasError}
            onAuthButtonClick={handleAuthButtonClick}
          />
        );
      case AuthStage.PhoneAuth:
        return (
          <PhoneAuth onFinish={handlePhoneStageFinish} onError={handleError} />
        );
      case AuthStage.CompleteAccountDetails:
        return user ? (
          <UserDetails user={user} closeModal={handleClose} />
        ) : null;
      default:
        return null;
    }
  }, [
    stage,
    hasError,
    handleClose,
    user,
    handleAuthButtonClick,
    handlePhoneStageFinish,
    handleError,
  ]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={handleClose}
      className="mobile-full-screen"
      mobileFullScreen
      onGoBack={shouldShowBackButton ? handleGoBack : undefined}
    >
      {content}
    </Modal>
  );
};

export default LoginContainer;
