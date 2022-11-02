import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BackgroundNotificationModal,
  TutorialModal,
} from "@/shared/components";
import { NotificationProvider } from "@/shared/components/Notification";
import { SMALL_SCREEN_BREAKPOINT, ScreenSize } from "@/shared/constants";
import { useScreenSize } from "@/shared/hooks";
import { changeScreenSize } from "@/shared/store/actions";
import { selectTutorialModalState } from "@/shared/store/selectors";
import { TextDirectionHandler, WebViewLoginHandler } from "./handlers";
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
    <>
      <BackgroundNotificationModal />
      <TutorialModal isShowing={tutorialModalState.isShowing} />
      <NotificationProvider>
        <TextDirectionHandler />
        <WebViewLoginHandler />
        <Router />
      </NotificationProvider>
    </>
  );
};

export default App;
