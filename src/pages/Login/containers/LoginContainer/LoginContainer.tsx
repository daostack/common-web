import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  FC,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { Modal } from "@/shared/components";
import {
  AuthProvider,
  ErrorCode,
  ScreenSize,
  QueryParamKey,
  ROUTE_PATHS,
} from "@/shared/constants";
import { useQueryParams, useRemoveQueryParams } from "@/shared/hooks";
import { ModalProps, ModalType } from "@/shared/interfaces";
import { getScreenSize } from "@/shared/store/selectors";
import {
  emptyFunction,
  getFirebaseAuthProvider,
  getInboxPagePath,
  isGeneralError,
  matchOneOfRoutes,
} from "@/shared/utils";
import firebase, { isFirebaseError } from "@/shared/utils/firebase";
import { LoginModalType } from "../../../Auth/interface";
import {
  setLoginModalState,
  loginWithFirebaseUser,
  startAuthLoading,
  stopAuthLoading,
} from "../../../Auth/store/actions";
import {
  selectIsAuthenticated,
  selectIsAuthLoading,
  selectLoginModalState,
  selectUser,
} from "../../../Auth/store/selectors";
import { Connect } from "../../components/LoginContainer/Connect";
import { PhoneAuth } from "../../components/LoginContainer/PhoneAuth";
import UserDetailsWrapper from "../../components/LoginContainer/UserDetails/UserDetailsWrapper";
import { AuthStage } from "../../components/LoginContainer/constants";
import {
  DEFAULT_AUTH_ERROR_TEXT,
  ERROR_TEXT_FOR_NON_EXISTENT_USER,
} from "../../constants";
import { getAuthCode } from "./helpers";
import "./index.scss";

const LoginContainer: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const location = useLocation();
  const { removeQueryParams } = useRemoveQueryParams();
  const isAuthenticated = useSelector(selectIsAuthenticated());
  const isLoading = useSelector(selectIsAuthLoading());
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [stage, setStage] = useState(AuthStage.AuthMethodSelect);
  const [errorText, setErrorText] = useState("");
  const [isNewUserCreated, setIsNewUserCreated] = useState(false);
  const {
    isShowing,
    type,
    title: loginModalTitle,
    canCloseModal = true,
    shouldShowUserDetailsAfterSignUp = true,
  } = useSelector(selectLoginModalState());
  const shouldShowBackButton = stage === AuthStage.PhoneAuth && !isLoading;
  const shouldRemoveHorizontalPadding =
    isMobileView && stage === AuthStage.AuthMethodSelect;
  const modalType =
    type === LoginModalType.RequestToJoin &&
    stage === AuthStage.AuthMethodSelect &&
    !isLoading
      ? ModalType.MobilePopUp
      : ModalType.Default;
  const hasError = Boolean(errorText);
  const { authCode, shouldOpenLoginModal } = getAuthCode(
    queryParams,
    location.pathname,
  );

  const handleClose = useCallback(() => {
    dispatch(setLoginModalState({ isShowing: false }));
  }, [dispatch, location.pathname]);

  const handleError = useCallback((errorText?: string) => {
    setErrorText(errorText || DEFAULT_AUTH_ERROR_TEXT);
    setStage(AuthStage.AuthMethodSelect);
  }, []);

  const handleAuthFinish = useCallback(
    (isNewUser = false) => {
      removeQueryParams(QueryParamKey.AuthCode);
      setIsNewUserCreated(isNewUser);

      if (isNewUser && shouldShowUserDetailsAfterSignUp) {
        setStage(AuthStage.CompleteAccountDetails);
      } else {
        handleClose();
      }
      if (
        !matchOneOfRoutes(
          history.location.pathname,
          [ROUTE_PATHS.COMMON, ROUTE_PATHS.V04_COMMON],
          {
            exact: false,
          },
        )
      ) {
        history.push(getInboxPagePath());
      }
    },
    [
      removeQueryParams,
      handleClose,
      shouldShowUserDetailsAfterSignUp,
      history.location.pathname,
    ],
  );

  const handleAuthButtonClick = useCallback(
    (provider: AuthProvider) => {
      setErrorText("");

      if (provider === AuthProvider.Phone) {
        setStage(AuthStage.PhoneAuth);
        return;
      }

      const handleAuthError = (error: Error | null) => {
        if (
          isGeneralError(error) &&
          error.code === ErrorCode.CUserDoesNotExist
        ) {
          handleError(ERROR_TEXT_FOR_NON_EXISTENT_USER);
        } else if (
          !isFirebaseError(error) ||
          error.code !== "auth/popup-closed-by-user"
        ) {
          handleError();
        }

        dispatch(stopAuthLoading());
      };

      dispatch(startAuthLoading());
      firebase
        .auth()
        .signInWithPopup(getFirebaseAuthProvider(provider))
        .then(({ user }) =>
          dispatch(
            loginWithFirebaseUser.request({
              payload: { firebaseUser: user, authCode },
              callback: (error, data) => {
                if (error) {
                  handleAuthError(error);
                  return;
                }

                handleAuthFinish(data?.isNewUser);
              },
            }),
          ),
        )
        .catch(handleAuthError);
    },
    [dispatch, handleError, handleAuthFinish, authCode],
  );

  const handleGoBack = useCallback(() => {
    setStage((stage) =>
      stage === AuthStage.PhoneAuth ? AuthStage.AuthMethodSelect : stage - 1,
    );
  }, []);

  useEffect(() => {
    if (!isShowing) {
      setStage(AuthStage.AuthMethodSelect);
      setErrorText("");
      setIsNewUserCreated(false);
    }
  }, [isShowing]);

  useEffect(() => {
    if (!isAuthenticated && authCode && shouldOpenLoginModal) {
      dispatch(setLoginModalState({ isShowing: true }));
    }
  }, [authCode, shouldOpenLoginModal]);

  const title = useMemo((): ReactNode => {
    if (!isMobileView || stage !== AuthStage.CompleteAccountDetails) {
      return null;
    }

    return (
      <img
        className="login-container__title-logo"
        src="/icons/logo.svg"
        alt="Common Logo"
      />
    );
  }, [isMobileView, stage]);

  const styles = useMemo<ModalProps["styles"]>(() => {
    if (isMobileView && stage === AuthStage.AuthMethodSelect) {
      return {
        content: "login-container__modal-content",
      };
    }
  }, [isMobileView, stage]);

  const content = useMemo(() => {
    switch (stage) {
      case AuthStage.AuthMethodSelect:
        return (
          <Connect
            loginModalTitle={loginModalTitle}
            errorText={errorText}
            isJoinRequestType={type === LoginModalType.RequestToJoin}
            onAuthButtonClick={handleAuthButtonClick}
          />
        );
      case AuthStage.PhoneAuth:
        return (
          <PhoneAuth
            authCode={authCode}
            onFinish={handleAuthFinish}
            onError={handleError}
          />
        );
      case AuthStage.CompleteAccountDetails:
        return user ? (
          <UserDetailsWrapper
            user={user}
            isNewUser={isNewUserCreated}
            closeModal={handleClose}
          />
        ) : null;
      default:
        return null;
    }
  }, [
    stage,
    hasError,
    loginModalTitle,
    errorText,
    handleClose,
    user,
    type,
    authCode,
    handleAuthButtonClick,
    handleAuthFinish,
    handleError,
    isNewUserCreated,
  ]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={canCloseModal && !isLoading ? handleClose : emptyFunction}
      type={modalType}
      className="login-container__modal"
      mobileFullScreen
      onGoBack={shouldShowBackButton ? handleGoBack : undefined}
      title={title}
      withoutHorizontalPadding={shouldRemoveHorizontalPadding}
      styles={styles}
      hideCloseButton={!canCloseModal || isLoading}
    >
      {content}
    </Modal>
  );
};

export default LoginContainer;
