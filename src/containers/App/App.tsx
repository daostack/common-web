import React from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AuthContainer } from "../Auth";
import PrivateRoute from "./PrivateRoute";
import { Content, NotFound, Footer, Header } from "../../shared/components";
import { CommonContainer } from "../Common";
import { LandingContainer } from "../Landing";
import { ROUTE_PATHS, SMALL_SCREEN_BREAKPOINT, ScreenSize } from "../../shared/constants";
import { changeScreenSize } from "../../shared/store/actions";

const App = () => {
  const dispatch = useDispatch();
  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", (screenSize) => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
  });

  return (
    <div className="App">
      <Header />
      <Content>
        <Switch>
          <Route path={ROUTE_PATHS.AUTH} component={AuthContainer} />
          <Route path="/" exact component={LandingContainer} />
          <PrivateRoute path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} authentificated={true} />
          <Route component={NotFound} />
        </Switch>
      </Content>
      <Footer />
    </div>
  );
};

export default App;
