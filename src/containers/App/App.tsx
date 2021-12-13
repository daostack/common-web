import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";

import PrivateRoute from "./PrivateRoute";
import { Content, NotFound, Footer, Header } from "../../shared/components";
import { CommonContainer } from "../Common";
import { LandingContainer } from "../Landing";
import { ROUTE_PATHS, SMALL_SCREEN_BREAKPOINT, ScreenSize } from "../../shared/constants";
import { changeScreenSize } from "../../shared/store/actions";
import { MyCommonsContainer } from "../Common/containers/MyCommonsContainer";
import { SubmitInvoicesContainer } from "../SubmitInvoices/containers/SubmitInvoicesContainer";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
    const handleScreenSizeChange = (screenSize: MediaQueryListEvent) => {
      dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
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
          <PrivateRoute path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} authentificated={true} />
          <PrivateRoute path={ROUTE_PATHS.MY_COMMONS} component={MyCommonsContainer} authentificated={true} />

          {/* TODO: According the desgin it should be displayed without showing the Header and the Footer. Need to discuss about that. */}
          <PrivateRoute path={ROUTE_PATHS.SUBMIT_INVOICES} component={SubmitInvoicesContainer} authentificated={true} />

          <Route component={NotFound} />
        </Switch>
      </Content>
      <Footer />
    </div>
  );
};

export default App;
