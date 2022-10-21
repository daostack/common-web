import React, { useCallback, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PrivateRoute from "./PrivateRoute";
import { Content, NotFound, Footer, Header, Modal, TutorialModal } from "@/shared/components";
import { NotificationProvider } from "@/shared/components/Notification";
import {
  CommonContainer,
  ProposalContainer,
  ProposalCommentContainer,
  DiscussionContainer,
  DiscussionMessageContainer,
} from "../Common";
import { ContactUsContainer, LandingContainer } from "../Landing";
import {
  ROUTE_PATHS,
  SMALL_SCREEN_BREAKPOINT,
  ScreenSize,
  WebviewActions,
} from "../../shared/constants";
import { changeScreenSize, showNotification } from "@/shared/store/actions";
import { authentificated } from "../Auth/store/selectors";
import { MyCommonsContainer } from "../Common/containers/MyCommonsContainer";
import { SubmitInvoicesContainer } from "../Invoices/containers";
import { TrusteeContainer } from "../Trustee/containers";
import { MyAccountContainer } from "../MyAccount/containers/MyAccountContainer";

import { getNotification, selectIsRtlLanguage, selectTutorialModalState } from "@/shared/store/selectors";
import { useModal } from "@/shared/hooks";
import classNames from "classnames";
import { BackgroundNotification } from "@/shared/components/BackgroundNotification";
import { EventTypeState } from "@/shared/models/Notification";

import { useHistory } from "react-router";
import { parseJson } from "@/shared/utils/json";

import { webviewLogin } from "../Auth/store/actions";
import { FirebaseCredentials } from "@/shared/interfaces/FirebaseCredentials";
import config from "@/config";

const App = () => {
  const dispatch = useDispatch();
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
  const isAuthenticated = useSelector(authentificated());
  const notification = useSelector(getNotification());
  const tutorialModalState = useSelector(selectTutorialModalState());
  const history = useHistory();
  const { search: queryString } = history.location;

  const {
    isShowing: isShowingNotification,
    onOpen: showNote,
    onClose: closeNotification,
  } = useModal(false);

  useEffect(() => {
    window.addEventListener('message', event => {
      const data = parseJson(event.data) as FirebaseCredentials;
      if (!data?.providerId) {
        return;
      }

      try {
        dispatch(webviewLogin.request({
          payload: data,
            callback: (isLoggedIn) => {
              if(isLoggedIn) {
                window.ReactNativeWebView.postMessage(WebviewActions.loginSuccess);
                history.push(ROUTE_PATHS.MY_COMMONS)
              }
            }
        }));
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

  useEffect(() => {
    const classNameToAdd = isRtlLanguage ? "direction--rtl" : "direction--ltr";
    const classNameToRemove = isRtlLanguage
      ? "direction--ltr"
      : "direction--rtl";

    document.body.classList.remove(classNameToRemove);
    document.body.classList.add(classNameToAdd);
  }, [isRtlLanguage]);

  const closeNotificationHandler = useCallback(() => {
    closeNotification();
    dispatch(showNotification(null));
    if (notification?.type === EventTypeState.fundingRequestAccepted) {
      const path =
        notification.additionalInformation === "0"
          ? ROUTE_PATHS.PROPOSAL_DETAIL.replace(
              ":id",
              notification.eventObjectId
            )
          : ROUTE_PATHS.SUBMIT_INVOICES.replace(
              ":proposalId",
              notification.eventObjectId
            );
      history.push(path);
    }
  }, [closeNotification, history, notification, dispatch]);

  return (
    <div className="App">
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
      <TutorialModal isShowing={tutorialModalState.isShowing}/>
      <NotificationProvider>
        <Header />
        <Content>
          <Switch>
            <Route path={ROUTE_PATHS.HOME} exact component={LandingContainer} />
            <Route
              path={ROUTE_PATHS.CONTACT_US}
              exact
              component={ContactUsContainer}
            />
            <Route path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} />
            <PrivateRoute
              path={ROUTE_PATHS.PROPOSAL_DETAIL}
              component={ProposalContainer}
              authenticated={isAuthenticated}
            />
            <PrivateRoute
              path={ROUTE_PATHS.PROPOSAL_COMMENT}
              component={ProposalCommentContainer}
              authenticated={isAuthenticated}
            />
            <PrivateRoute
              path={ROUTE_PATHS.DISCUSSION_DETAIL}
              component={DiscussionContainer}
              authenticated={isAuthenticated}
            />
            <PrivateRoute
              path={ROUTE_PATHS.DISCUSSION_MESSAGE}
              component={DiscussionMessageContainer}
              authenticated={isAuthenticated}
            />
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
            <Redirect
              from={ROUTE_PATHS.DEAD_SEA}
              to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
                ":id",
                config.deadSeaCommonId
              )}${queryString}`}
            />
            <Redirect
              from={ROUTE_PATHS.PARENTS_FOR_CLIMATE}
              to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
                ":id",
                config.parentsForClimateCommonId
              )}${queryString}`}
            />
            <Redirect
              from={ROUTE_PATHS.SAVE_SAADIA}
              to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
                ":id",
                config.saadiaCommonId
              )}${queryString}`}
            />
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Footer />
      </NotificationProvider>
    </div>
  );
};

export default App;
