import React, { useCallback, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PrivateRoute from "./PrivateRoute";
import { Content, NotFound, Footer, Header, Modal } from "@/shared/components";
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
} from "../../shared/constants";
import { changeScreenSize, showNotification } from "@/shared/store/actions";
import { authentificated } from "../Auth/store/selectors";
import { MyCommonsContainer } from "../Common/containers/MyCommonsContainer";
import { SubmitInvoicesContainer } from "../Invoices/containers";
import { TrusteeContainer } from "../Trustee/containers";
import { MyAccountContainer } from "../MyAccount/containers/MyAccountContainer";

import { getNotification } from "@/shared/store/selectors";
import { useModal } from "@/shared/hooks";
import classNames from "classnames";
import { BackgroundNotification } from "@/shared/components/BackgroundNotification";
import { EventTypeState } from "@/shared/models/Notification";

import { useHistory } from "react-router";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authentificated());
  const notification = useSelector(getNotification());
  const history = useHistory();

  const {
    isShowing: isShowingNotification,
    onOpen: showNote,
    onClose: closeNotification,
  } = useModal(false);

  useEffect(() => {
    window.addEventListener('message', event => {
      const data = parseJson(event.data);
      if (data?.providerId) {
        (async () => {
          try {
            let credential;
            if(data.providerId === AuthProviderID.Apple) {
              const provider = new firebase.auth.OAuthProvider(data.providerId);
              credential = provider.credential(data);
            } else {
              const provider = getProvider(data?.providerId);
              credential = provider.credential(data.idToken);
            }

            const { user } = await firebase.auth().signInWithCredential(credential);
            dispatch(webviewLogin.request({
              payload: user,
              callback: (isLoggedIn) => {
                if(isLoggedIn) {
                  history.push(ROUTE_PATHS.MY_COMMONS)
                }
              }
            }));
         
          } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action: JSON.stringify(err) }));
          }
        })()
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

  const closeNotificationHandler = useCallback(() => {
    closeNotification();
    dispatch(showNotification(null));
    if (notification?.type === EventTypeState.fundingRequestAccepted) {
      history.push(
        ROUTE_PATHS.SUBMIT_INVOICES.replace(
          ":proposalId",
          notification.eventObjectId
        )
      );
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
            <PrivateRoute
              path={ROUTE_PATHS.COMMON_LIST}
              component={CommonContainer}
              authenticated={isAuthenticated}
            />
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
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Footer />
      </NotificationProvider>
    </div>
  );
};

export default App;
