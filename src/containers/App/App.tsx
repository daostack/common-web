import React, { useCallback, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PrivateRoute from "./PrivateRoute";
import { Content, NotFound, Footer, Header, Modal } from "@/shared/components";
import { NotificationProvider } from "@/shared/components/Notification";
import { CommonContainer } from "../Common";
import { LandingContainer } from "../Landing";
import {
  ROUTE_PATHS,
  SMALL_SCREEN_BREAKPOINT,
  ScreenSize,
} from "../../shared/constants";
import { changeScreenSize, showNotification } from "../../shared/store/actions";
import { authentificated } from "../Auth/store/selectors";
import { MyCommonsContainer } from "../Common/containers/MyCommonsContainer";
import { SubmitInvoicesContainer } from "../Invoices/containers";
import { TrusteeContainer } from "../Trustee/containers";
import { MyAccountContainer } from "../MyAccount/containers/MyAccountContainer";

import { getNotification, getScreenSize } from "@/shared/store/selectors";
import { useModal } from "@/shared/hooks";
import classNames from "classnames";
import NotificationLayout from "@/shared/components/Notification/NotificationLayout/NotificationLayout";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authentificated());
  const notification = useSelector(getNotification());

  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const {
    isShowing: isShowingNotification,
    onOpen: showNote,
    onClose: closeNotification,
  } = useModal(false);

  useEffect(() => {
    if (notification) {
      showNote();
    }
  }, [notification, showNote]);

  useEffect(() => {
    const screenSize = window.matchMedia(
      `(min-width: ${SMALL_SCREEN_BREAKPOINT})`
    );
    const handleScreenSizeChange = (screenSize: MediaQueryListEvent) => {
      dispatch(
        changeScreenSize(
          screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile
        )
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
  }, [closeNotification, dispatch]);

  return (
    <div className="App">
      {isShowingNotification && notification && (
        <Modal
          isShowing={isShowingNotification}
          onClose={closeNotificationHandler}
          className={classNames("notification", {
            // "mobile-full-screen": isMobileView,
          })}
          //  mobileFullScreen={isMobileView}
        >
          <NotificationLayout
            notification={notification}
            closeHandler={closeNotificationHandler}
          />
        </Modal>
      )}
      <NotificationProvider>
        <Header />
        <Content>
          <Switch>
            <Route path="/" exact component={LandingContainer} />
            <Route path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} />
            <PrivateRoute
              path={ROUTE_PATHS.MY_ACCOUNT}
              component={MyAccountContainer}
              authenticated={isAuthenticated}
            />
            <PrivateRoute
              path={ROUTE_PATHS.MY_COMMONS}
              component={MyCommonsContainer}
              authenticated={isAuthenticated}
            />
            <Route
              path={ROUTE_PATHS.SUBMIT_INVOICES}
              component={SubmitInvoicesContainer}
            />
            <Route path={ROUTE_PATHS.TRUSTEE} component={TrusteeContainer} />
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Footer />
      </NotificationProvider>
    </div>
  );
};

export default App;
