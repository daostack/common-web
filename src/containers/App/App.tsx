import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PrivateRoute from "./PrivateRoute";
import { Content, NotFound, Footer, Header } from "../../shared/components";
import { CommonContainer } from "../Common";
import { LandingContainer } from "../Landing";
import {
  ROUTE_PATHS,
  SMALL_SCREEN_BREAKPOINT,
  ScreenSize,
} from "../../shared/constants";
import { changeScreenSize } from "../../shared/store/actions";
import { authentificated } from "../Auth/store/selectors";
import { MyCommonsContainer } from "../Common/containers/MyCommonsContainer";
import { SubmitInvoicesContainer } from "../Invoices/containers";
import { TrusteeContainer } from "../Trustee/containers";
import NotificationManager from "@/shared/components/Notification/NotificationManager";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authentificated());

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

  return (
    <div className="App">
      <Header />
      <Content>
        <Switch>
          <Route path="/" exact component={LandingContainer} />
          <Route path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} />
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
      <NotificationManager />
    </div>
  );
};

export default App;
