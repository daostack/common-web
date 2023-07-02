import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router as ReactRouter } from "react-router";
import { LoginContainer } from "@/pages/Login/containers/LoginContainer";
import { history } from "@/shared/appConfig";
import {
  BackgroundNotificationModal,
  TutorialModal,
} from "@/shared/components";
import { SMALL_SCREEN_BREAKPOINT, ScreenSize } from "@/shared/constants";
import { useScreenSize } from "@/shared/hooks";
import { changeScreenSize } from "@/shared/store/actions";
import { selectTutorialModalState } from "@/shared/store/selectors";
import {
  TextDirectionHandler,
  ThemeHandler,
  UserNotificationsAmountHandler,
  WebViewLoginHandler,
} from "./handlers";
import { Router } from "./router";

const App = () => {
  const dispatch = useDispatch();
  const tutorialModalState = useSelector(selectTutorialModalState());
  const isDesktop = useScreenSize(`min-width: ${SMALL_SCREEN_BREAKPOINT}`);

  useEffect(() => {
    dispatch(
      changeScreenSize(isDesktop ? ScreenSize.Desktop : ScreenSize.Mobile),
    );
  }, [dispatch, isDesktop]);

  return (
    <ReactRouter history={history}>
      <BackgroundNotificationModal />
      <TutorialModal isShowing={tutorialModalState.isShowing} />
      <TextDirectionHandler />
      <ThemeHandler />
      <UserNotificationsAmountHandler />
      <WebViewLoginHandler />
      <LoginContainer />
      <Router />
    </ReactRouter>
  );
};

export default App;
