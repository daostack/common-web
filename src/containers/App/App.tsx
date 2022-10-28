import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import classNames from "classnames";
import { Modal, TutorialModal } from "@/shared/components";
import { BackgroundNotification } from "@/shared/components/BackgroundNotification";
import { NotificationProvider } from "@/shared/components/Notification";
import { useModal } from "@/shared/hooks";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import { EventTypeState } from "@/shared/models/Notification";
import { changeScreenSize, showNotification } from "@/shared/store/actions";
import {
  getNotification,
  selectTutorialModalState,
} from "@/shared/store/selectors";
import { parseJson } from "@/shared/utils/json";
import {
  ROUTE_PATHS,
  SMALL_SCREEN_BREAKPOINT,
  ScreenSize,
  WebviewActions,
} from "../../shared/constants";
import { webviewLogin } from "../Auth/store/actions";
import { TextDirectionHandler } from "./handlers";
import { Router } from "./router";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector(getNotification());
  const tutorialModalState = useSelector(selectTutorialModalState());
  const history = useHistory();

  const {
    isShowing: isShowingNotification,
    onOpen: showNote,
    onClose: closeNotification,
  } = useModal(false);

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
    if (notification) {
      showNote();
    }
  }, [notification, showNote]);

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

  const closeNotificationHandler = useCallback(() => {
    closeNotification();
    dispatch(showNotification(null));
    if (notification?.type === EventTypeState.fundingRequestAccepted) {
      const path =
        notification.additionalInformation === "0"
          ? ROUTE_PATHS.PROPOSAL_DETAIL.replace(
              ":id",
              notification.eventObjectId,
            )
          : ROUTE_PATHS.SUBMIT_INVOICES.replace(
              ":proposalId",
              notification.eventObjectId,
            );
      history.push(path);
    }
  }, [closeNotification, history, notification, dispatch]);

  return (
    <>
      {isShowingNotification && notification && (
        <Modal
          isShowing={isShowingNotification}
          onClose={closeNotificationHandler}
          className={classNames("notification")}
        >
          <BackgroundNotification
            notification={notification}
            closeHandler={closeNotificationHandler}
          />
        </Modal>
      )}
      <TutorialModal isShowing={tutorialModalState.isShowing} />
      <NotificationProvider>
        <TextDirectionHandler />
        <Router />
      </NotificationProvider>
    </>
  );
};

export default App;
