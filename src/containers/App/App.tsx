import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  BackgroundNotificationModal,
  TutorialModal,
} from "@/shared/components";
import { NotificationProvider } from "@/shared/components/Notification";
import {
  ROUTE_PATHS,
  SMALL_SCREEN_BREAKPOINT,
  ScreenSize,
  WebviewActions,
} from "@/shared/constants";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import { changeScreenSize } from "@/shared/store/actions";
import { selectTutorialModalState } from "@/shared/store/selectors";
import { parseJson } from "@/shared/utils/json";
import { webviewLogin } from "../Auth/store/actions";
import { TextDirectionHandler } from "./handlers";
import { Router } from "./router";

const App = () => {
  const dispatch = useDispatch();
  const tutorialModalState = useSelector(selectTutorialModalState());
  const history = useHistory();

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const data = parseJson(event.data) as FirebaseCredentials;
      if (!data?.providerId) {
        return;
      }

      try {
        dispatch(
          webviewLogin.request({
            payload: data,
            callback: (isLoggedIn) => {
              if (isLoggedIn) {
                window.ReactNativeWebView.postMessage(
                  WebviewActions.loginSuccess,
                );
                history.push(ROUTE_PATHS.MY_COMMONS);
              }
            },
          }),
        );
      } catch (err) {
        window.ReactNativeWebView.postMessage(WebviewActions.loginError);
      }
    });
  }, []);

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
        <Router />
      </NotificationProvider>
    </>
  );
};

export default App;
