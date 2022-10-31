import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BackgroundNotificationModal,
  TutorialModal,
} from "@/shared/components";
import { NotificationProvider } from "@/shared/components/Notification";
import { SMALL_SCREEN_BREAKPOINT, ScreenSize } from "@/shared/constants";
import { changeScreenSize } from "@/shared/store/actions";
import { selectTutorialModalState } from "@/shared/store/selectors";
import { TextDirectionHandler, WebViewLoginHandler } from "./handlers";
import { Router } from "./router";

const App = () => {
  const dispatch = useDispatch();
  const tutorialModalState = useSelector(selectTutorialModalState());

  useEffect(() => {
    const screenSize = window.matchMedia(
      `(min-width: ${SMALL_SCREEN_BREAKPOINT})`,
    );
    const handleScreenSizeChange = (screenSize: MediaQueryListEvent) => {
      dispatch(
        changeScreenSize(
          screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile,
        ),
      );
    };

    // Condition is added to solve issue https://www.designcise.com/web/tutorial/how-to-fix-the-javascript-typeerror-matchmedia-addeventlistener-is-not-a-function
    if (screenSize.addEventListener) {
      screenSize.addEventListener("change", handleScreenSizeChange);
    } else {
      screenSize.addListener(handleScreenSizeChange);
    }

    return () => {
      if (screenSize.removeEventListener) {
        screenSize.removeEventListener("change", handleScreenSizeChange);
      } else {
        screenSize.removeListener(handleScreenSizeChange);
      }
    };
  }, [dispatch]);

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
